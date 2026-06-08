import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { sendStatusUpdateSMS } from '@/lib/sms';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status, doctor_id, preferred_date } = await request.json();

    // Authenticate
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isPrivileged = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isPrivileged) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if appointment exists
    const appointment = await queryD1First('SELECT * FROM appointments WHERE id = ?', [id]);
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // If current user is a doctor, they can only update appointments assigned to them
    if (currentUser.role === 'doctor') {
      const doctor = await queryD1First('SELECT id FROM doctors WHERE user_id = ?', [currentUser.userId]);
      if (!doctor || appointment.doctor_id !== doctor.id) {
        return NextResponse.json({ error: 'Forbidden: You can only update your own appointments' }, { status: 403 });
      }
    }

    const updates = [];
    const paramsList = [];

    if (status !== undefined) {
      const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
          { status: 400 }
        );
      }
      updates.push('status = ?');
      paramsList.push(status);
    }

    if (doctor_id !== undefined) {
      updates.push('doctor_id = ?');
      paramsList.push(doctor_id || null);
    }

    if (preferred_date !== undefined) {
      updates.push('preferred_date = ?');
      paramsList.push(preferred_date);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    paramsList.push(id);
    await queryD1(`UPDATE appointments SET ${updates.join(', ')} WHERE id = ?`, paramsList);

    // Send update SMS if status changed
    if (status && status !== appointment.status) {
      try {
        let statusText = status;
        if (status === 'confirmed') statusText = 'confirmed';
        if (status === 'cancelled') statusText = 'cancelled';
        if (status === 'completed') statusText = 'completed';

        await sendStatusUpdateSMS(appointment.phone, appointment.patient_name, statusText);
      } catch (smsErr) {
        console.error('Failed to send status update SMS:', smsErr.message);
      }
    } else if (preferred_date && preferred_date !== appointment.preferred_date) {
      try {
        const formattedDate = new Date(preferred_date).toLocaleDateString('en-US', { dateStyle: 'medium' });
        await sendSMS(
          appointment.phone,
          `Dear ${appointment.patient_name}, your appointment at Om Chaudhary Hospital has been rescheduled to ${formattedDate}.`
        );
      } catch (smsErr) {
        console.error('Failed to send reschedule SMS:', smsErr.message);
      }
    }

    return NextResponse.json({ success: true, status, preferred_date });
  } catch (error) {
    console.error('Update appointment status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
