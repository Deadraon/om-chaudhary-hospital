import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { generateId, now } from '@/lib/utils';

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
        SELECT lr.*, p.name AS patient_name, p.phone AS patient_phone
        FROM lab_reports lr
        JOIN patients p ON lr.patient_id = p.id
        ORDER BY lr.uploaded_at DESC
      `);
    } else if (currentUser.role === 'patient') {
      // Patients get only their own reports
      reports = await queryD1(`
        SELECT lr.*
        FROM lab_reports lr
        JOIN patients p ON lr.patient_id = p.id
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
 * POST: Create a lab report entry (Staff only)
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patient_id, title, r2_file_key } = await request.json();

    if (!patient_id || !title || !r2_file_key) {
      return NextResponse.json(
        { error: 'Patient ID, title, and file key are required' },
        { status: 400 }
      );
    }

    // Verify patient profile exists
    const patient = await queryD1First('SELECT id FROM patients WHERE id = ?', [patient_id]);
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const id = generateId();
    const timestamp = now();

    await queryD1(`
      INSERT INTO lab_reports (id, patient_id, title, r2_file_key, uploaded_at)
      VALUES (?, ?, ?, ?, ?)
    `, [id, patient_id, title.trim(), r2_file_key, timestamp]);

    return NextResponse.json({ success: true, reportId: id });
  } catch (error) {
    console.error('Create lab report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
