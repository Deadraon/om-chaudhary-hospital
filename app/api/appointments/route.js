import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { sendAppointmentSMS } from '@/lib/sms';
import { generateId, now } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/**
 * GET: Retrieve appointments
 * - Public: query?phone=1234567890 (no auth)
 * - Authenticated: returns role-filtered appointments
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneQuery = searchParams.get('phone');

    // Case 1: Public status lookup by phone
    if (phoneQuery) {
      const cleanPhone = phoneQuery.trim();
      const appointments = await queryD1(`
        SELECT a.*, dept.name AS department_name, doc.name AS doctor_name, doc.speciality AS doctor_speciality
        FROM appointments a
        LEFT JOIN departments dept ON a.department_id = dept.id
        LEFT JOIN doctors doc ON a.doctor_id = doc.id
        WHERE a.phone = ?
        ORDER BY a.created_at DESC
      `, [cleanPhone]);

      return NextResponse.json(appointments);
    }

    // Case 2: Authenticated dashboard retrieval
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let appointments = [];

    if (currentUser.role === 'super_admin' || currentUser.role === 'receptionist') {
      // Admins and receptionists get ALL appointments
      appointments = await queryD1(`
        SELECT a.*, dept.name AS department_name, doc.name AS doctor_name, doc.speciality AS doctor_speciality
        FROM appointments a
        LEFT JOIN departments dept ON a.department_id = dept.id
        LEFT JOIN doctors doc ON a.doctor_id = doc.id
        ORDER BY a.created_at DESC
      `);
    } else if (currentUser.role === 'doctor') {
      // Find doctor profile for this user
      const doctor = await queryD1First('SELECT id FROM doctors WHERE user_id = ?', [currentUser.userId]);
      if (!doctor) {
        return NextResponse.json([]);
      }
      
      // Doctors get their own appointments
      appointments = await queryD1(`
        SELECT a.*, dept.name AS department_name, doc.name AS doctor_name, doc.speciality AS doctor_speciality
        FROM appointments a
        LEFT JOIN departments dept ON a.department_id = dept.id
        LEFT JOIN doctors doc ON a.doctor_id = doc.id
        WHERE a.doctor_id = ?
        ORDER BY a.created_at DESC
      `, [doctor.id]);
    } else if (currentUser.role === 'patient') {
      // Find patient profile for this user to get phone number
      const patient = await queryD1First('SELECT phone FROM patients WHERE user_id = ?', [currentUser.userId]);
      if (!patient || !patient.phone) {
        return NextResponse.json([]);
      }

      // Patients get their own appointments by phone
      appointments = await queryD1(`
        SELECT a.*, dept.name AS department_name, doc.name AS doctor_name, doc.speciality AS doctor_speciality
        FROM appointments a
        LEFT JOIN departments dept ON a.department_id = dept.id
        LEFT JOIN doctors doc ON a.doctor_id = doc.id
        WHERE a.phone = ?
        ORDER BY a.created_at DESC
      `, [patient.phone]);
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Fetch appointments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { rateLimit } from '@/lib/rate-limiter';

/**
 * POST: Create an appointment (Public booking or Receptionist booking)
 */
export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const limitCheck = await rateLimit(`appointment:${ip}`, 10, 60); // Max 10 bookings/min
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many booking attempts. Please try again after a minute.' },
        { status: 429 }
      );
    }

    const { patient_name, phone, department_id, doctor_id, preferred_date, message } = await request.json();

    if (!patient_name || !phone || !department_id || !preferred_date) {
      return NextResponse.json(
        { error: 'Patient name, phone, department, and preferred date are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[\s\-\+]/g, '').trim();
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Double-booking & schedule checks if a doctor is selected
    if (doctor_id) {
      // 1. Verify doctor schedule availability on the weekday of the selected date
      const dateObj = new Date(preferred_date);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json({ error: 'Invalid preferred date format' }, { status: 400 });
      }
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[dateObj.getDay()];

      const schedule = await queryD1First(
        'SELECT id FROM doctor_schedules WHERE doctor_id = ? AND day_of_week = ?',
        [doctor_id, dayName]
      );
      if (!schedule) {
        return NextResponse.json(
          { error: `The selected doctor does not have scheduled OPD hours on ${dayName}. Please choose another day.` },
          { status: 400 }
        );
      }

      // 2. Prevent over-booking the doctor (max 15 active appointments per day)
      const countRes = await queryD1First(
        "SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND preferred_date = ? AND status != 'cancelled'",
        [doctor_id, preferred_date]
      );
      if (countRes && countRes.count >= 15) {
        return NextResponse.json(
          { error: 'This doctor is fully booked on the selected date (Limit: 15 per day). Please choose another date or practitioner.' },
          { status: 400 }
        );
      }

      // 3. Prevent duplicate active booking by the same patient for the same doctor on the same day
      const duplicate = await queryD1First(
        "SELECT id FROM appointments WHERE phone = ? AND doctor_id = ? AND preferred_date = ? AND status != 'cancelled'",
        [cleanPhone, doctor_id, preferred_date]
      );
      if (duplicate) {
        return NextResponse.json(
          { error: 'You already have an active appointment scheduled with this doctor on the selected date.' },
          { status: 400 }
        );
      }
    }

    const id = generateId();
    const timestamp = now();

    // Insert appointment
    await queryD1(`
      INSERT INTO appointments (id, patient_name, phone, doctor_id, department_id, preferred_date, status, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `, [
      id,
      patient_name.trim(),
      cleanPhone,
      doctor_id || null,
      department_id,
      preferred_date,
      message ? message.trim() : null,
      timestamp
    ]);

    // Send SMS confirmation
    try {
      let doctorName = 'Assigned Doctor';
      if (doctor_id) {
        const doctor = await queryD1First('SELECT name FROM doctors WHERE id = ?', [doctor_id]);
        if (doctor) doctorName = doctor.name;
      } else {
        const dept = await queryD1First('SELECT name FROM departments WHERE id = ?', [department_id]);
        if (dept) doctorName = `Specialist (${dept.name})`;
      }

      await sendAppointmentSMS(cleanPhone, patient_name.trim(), doctorName, preferred_date);
    } catch (smsErr) {
      console.error('Failed to send appointment confirmation SMS:', smsErr.message);
    }

    return NextResponse.json({ success: true, appointmentId: id });
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
