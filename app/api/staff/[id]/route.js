import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

/**
 * PUT: Update staff details (Admin only)
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, role, phone } = await request.json();

    const currentUser = await getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get staff record
    const staff = await queryD1First('SELECT * FROM staff WHERE id = ?', [id]);
    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Validate role if updating it
    if (role) {
      const allowedRoles = ['receptionist', 'super_admin'];
      if (!allowedRoles.includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
    }

    // Update staff record
    await queryD1(`
      UPDATE staff
      SET name = ?, role = ?, phone = ?
      WHERE id = ?
    `, [
      name ? name.trim() : staff.name,
      role || staff.role,
      phone ? phone.trim() : staff.phone,
      id
    ]);

    // Update role and name in users table
    if (staff.user_id) {
      const updates = [];
      const paramsList = [];
      if (name) {
        updates.push('name = ?');
        paramsList.push(name.trim());
      }
      if (role) {
        updates.push('role = ?');
        paramsList.push(role);
      }
      if (updates.length > 0) {
        paramsList.push(staff.user_id);
        await queryD1(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, paramsList);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update staff API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE: Delete staff member (Admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const currentUser = await getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if staff exists
    const staff = await queryD1First('SELECT * FROM staff WHERE id = ?', [id]);
    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Prevent deleting oneself
    if (staff.user_id === currentUser.userId) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    // Delete staff record
    await queryD1('DELETE FROM staff WHERE id = ?', [id]);

    // Delete associated user record
    if (staff.user_id) {
      await queryD1('DELETE FROM users WHERE id = ?', [staff.user_id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete staff API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
