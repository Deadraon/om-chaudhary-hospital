import { NextResponse } from 'next/server';
import { queryD1First, queryD1 } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { sendAppointmentSMS } from '@/lib/sms';

export const dynamic = 'force-dynamic';

/**
 * GET: Patient portal data
 * Returns profile, appointments, invoices, and discharge summaries
 */
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow patients to access their own portal
    if (currentUser.role !== 'patient') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch patient record linked to the user account
    const patient = await queryD1First(`
      SELECT p.*, u.email
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
    `, [currentUser.userId]);

    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Fetch appointments (upcoming and past)
    const appointments = await queryD1(`
      SELECT a.*,
             dept.name AS department_name,
             doc.name AS doctor_name,
             doc.speciality AS doctor_speciality
      FROM appointments a
      LEFT JOIN departments dept ON a.department_id = dept.id
      LEFT JOIN doctors doc ON a.doctor_id = doc.id
      WHERE a.phone = ?
      ORDER BY a.preferred_date DESC
    `, [patient.phone]);

    // Fetch invoices for this patient
    const invoices = await queryD1(`
      SELECT * FROM invoices
      WHERE patient_id = ?
      ORDER BY created_at DESC
    `, [patient.id]);

    // Fetch discharge summaries
    const dischargeSummaries = await queryD1(`
      SELECT * FROM discharge_summaries
      WHERE patient_id = ?
      ORDER BY uploaded_at DESC
    `, [patient.id]);

    return NextResponse.json({
      patient,
      appointments,
      invoices,
      dischargeSummaries
    });
  } catch (error) {
    console.error('Patient portal API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}