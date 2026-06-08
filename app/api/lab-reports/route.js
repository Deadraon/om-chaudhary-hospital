import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { generateId, now } from '@/lib/utils';
import { sendSMS } from '@/lib/sms';

/**
 * GET: Retrieve lab reports
 * - Patient: returns own reports
 * - Staff: returns all reports
 */
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let reports = [];

    if (['super_admin', 'receptionist', 'doctor'].includes(currentUser.role)) {
      // Staff members get all reports joined with patient details
      reports = await queryD1(`
        SELECT lr.*, p.name AS patient_name, p.phone AS patient_phone, d.name AS doctor_name
        FROM lab_reports lr
        JOIN patients p ON lr.patient_id = p.id
        LEFT JOIN doctors d ON lr.doctor_id = d.id
        ORDER BY lr.uploaded_at DESC
      `);
    } else if (currentUser.role === 'patient') {
      // Patients get only their own reports
      reports = await queryD1(`
        SELECT lr.*, d.name AS doctor_name
        FROM lab_reports lr
        JOIN patients p ON lr.patient_id = p.id
        LEFT JOIN doctors d ON lr.doctor_id = d.id
        WHERE p.user_id = ?
        ORDER BY lr.uploaded_at DESC
      `, [currentUser.userId]);
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Fetch lab reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Create a lab report entry (Staff & Patient allowed)
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { patient_id: req_patient_id, title, r2_file_key, doctor_id, test_type } = await request.json();

    if (!title || !r2_file_key) {
      return NextResponse.json(
        { error: 'Title and file key are required' },
        { status: 400 }
      );
    }

    let patient_id = req_patient_id;
    let patient = null;

    if (currentUser.role === 'patient') {
      // Patients can only upload for themselves
      patient = await queryD1First('SELECT id, name, phone FROM patients WHERE user_id = ?', [currentUser.userId]);
      if (!patient) {
        return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
      }
      patient_id = patient.id;
    } else {
      // Staff must supply patient_id
      if (!patient_id) {
        return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
      }
      patient = await queryD1First('SELECT id, name, phone FROM patients WHERE id = ?', [patient_id]);
      if (!patient) {
        return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
      }
    }

    const id = generateId();
    const timestamp = now();

    await queryD1(`
      INSERT INTO lab_reports (id, patient_id, title, r2_file_key, doctor_id, test_type, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, patient_id, title.trim(), r2_file_key, doctor_id || null, test_type || null, timestamp]);

    // Send SMS alert to patient (if staff uploaded it)
    if (currentUser.role !== 'patient' && patient.phone) {
      try {
        await sendSMS(
          patient.phone,
          `Dear ${patient.name}, your lab report "${title.trim()}" has been uploaded successfully. You can view it in your patient portal at Om Chaudhary Hospital.`
        );
      } catch (smsErr) {
        console.error('Failed to send lab report upload SMS:', smsErr.message);
      }
    }

    return NextResponse.json({ success: true, reportId: id });
  } catch (error) {
    console.error('Create lab report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
