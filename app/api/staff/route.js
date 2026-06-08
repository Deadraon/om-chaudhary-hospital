import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { generateId } from '@/lib/utils';

/**
 * GET: Fetch all staff (Admin only)
 */
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const staff = await queryD1(`
      SELECT s.*, u.email, u.role AS user_role
      FROM staff s
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY s.name ASC
    `);

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Fetch staff API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Create a new staff account (Admin only)
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, email, password, role, phone } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    const allowedRoles = [
      'receptionist', 'super_admin', 'doctor',
      'nurse', 'lab_technician', 'pharmacist',
      'ward_boy', 'accountant', 'other',
    ];

    // Allow custom role names (prefixed with 'custom:') or any non-empty string
    const isValidRole = allowedRoles.includes(role) || (typeof role === 'string' && role.trim().length > 0);
    if (!isValidRole) {
      return NextResponse.json(
        { error: 'Invalid role specified.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await queryD1First('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return NextResponse.json({ error: 'Account with this email already exists' }, { status: 409 });
    }

    const userId = generateId();
    const staffId = generateId();
    const passHash = await hashPassword(password);

    // Insert user record
    await queryD1(`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, name.trim(), email.toLowerCase().trim(), passHash, role]);

    // Insert staff record
    await queryD1(`
      INSERT INTO staff (id, user_id, name, role, phone, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      staffId,
      userId,
      name.trim(),
      role,
      phone ? phone.trim() : null,
      email.toLowerCase().trim()
    ]);

    return NextResponse.json({ success: true, staffId });
  } catch (error) {
    console.error('Create staff API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
