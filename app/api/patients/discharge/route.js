import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { generateId, now } from '@/lib/utils';
import { sendSMS } from '@/lib/sms';

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !['super_admin', 'receptionist', 'doctor'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { patient_id, r2_file_key, notes } = await request.json();

    if (!patient_id || !r2_file_key) {
      return NextResponse.json({ error: 'Patient ID and file key are required' }, { status: 400 });
    }

    // Verify patient profile
    const patient = await queryD1First('SELECT id, name, phone FROM patients WHERE id = ?', [patient_id]);
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const id = generateId();
    const timestamp = now();

    await queryD1(
      `INSERT INTO discharge_summaries (id, patient_id, r2_file_key, notes, uploaded_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, patient_id, r2_file_key, notes || '', timestamp]
    );

    // Send SMS alert to patient
    if (patient.phone) {
      try {
        await sendSMS(
          patient.phone,
          `Dear ${patient.name}, your hospital discharge summary report has been uploaded successfully. You can download it from your profile portal.`
        );
      } catch (smsErr) {
        console.error('Failed to send discharge summary upload SMS:', smsErr.message);
      }
    }

    return NextResponse.json({ success: true, dischargeId: id });
  } catch (error) {
    console.error('Save discharge summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
