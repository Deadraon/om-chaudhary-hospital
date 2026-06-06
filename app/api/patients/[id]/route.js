import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

/**
 * PUT: Update patient profile details
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params; // This is the patient record ID
    const { name, phone, dob, blood_group, address } = await request.json();

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get patient record
    const patient = await queryD1First('SELECT * FROM patients WHERE id = ?', [id]);
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Allow if user is super admin, receptionist, or if the user owns the patient record
    const isOwner = currentUser.userId === patient.user_id;
    const isStaff = ['super_admin', 'receptionist'].includes(currentUser.role);

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update patient table
    await queryD1(`
      UPDATE patients
      SET name = ?, phone = ?, dob = ?, blood_group = ?, address = ?
      WHERE id = ?
    `, [
      name ? name.trim() : patient.name,
      phone ? phone.trim() : patient.phone,
      dob !== undefined ? dob : patient.dob,
      blood_group !== undefined ? blood_group : patient.blood_group,
      address !== undefined ? address : patient.address,
      id
    ]);

    // Update users table name as well if changed and user_id exists
    if (name && patient.user_id) {
      await queryD1('UPDATE users SET name = ? WHERE id = ?', [name.trim(), patient.user_id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update patient API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET: Retrieve a single patient's details
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await queryD1First(`
      SELECT p.*, u.email
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const isOwner = currentUser.userId === patient.user_id;
    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Get patient API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
