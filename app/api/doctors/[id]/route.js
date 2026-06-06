import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromR2 } from '@/lib/r2';

/**
 * PUT: Update doctor details (Admin or Doctor themselves)
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, speciality, experience, phone, department_id, photo_r2_key } = await request.json();

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get doctor record
    const doctor = await queryD1First('SELECT * FROM doctors WHERE id = ?', [id]);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Allow if user is super admin or if the user is the doctor himself
    const isSelf = currentUser.role === 'doctor' && currentUser.userId === doctor.user_id;
    const isAdmin = currentUser.role === 'super_admin';

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update doctor record
    await queryD1(`
      UPDATE doctors
      SET name = ?, speciality = ?, experience = ?, phone = ?, department_id = ?, photo_r2_key = ?
      WHERE id = ?
    `, [
      name ? name.trim() : doctor.name,
      speciality ? speciality.trim() : doctor.speciality,
      experience ? experience.trim() : doctor.experience,
      phone ? phone.trim() : doctor.phone,
      department_id || doctor.department_id,
      photo_r2_key !== undefined ? photo_r2_key : doctor.photo_r2_key,
      id
    ]);

    // Also sync the name in users table
    if (name) {
      await queryD1('UPDATE users SET name = ? WHERE id = ?', [name.trim(), doctor.user_id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update doctor API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE: Delete doctor (Admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const currentUser = await getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if doctor exists
    const doctor = await queryD1First('SELECT * FROM doctors WHERE id = ?', [id]);
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Delete photo from R2 if it exists
    if (doctor.photo_r2_key) {
      try {
        await deleteFromR2(doctor.photo_r2_key);
      } catch (r2Err) {
        console.error('Failed to delete doctor photo from R2:', r2Err.message);
      }
    }

    // Delete doctor record
    await queryD1('DELETE FROM doctors WHERE id = ?', [id]);

    // Delete associated user record
    if (doctor.user_id) {
      await queryD1('DELETE FROM users WHERE id = ?', [doctor.user_id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete doctor API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
