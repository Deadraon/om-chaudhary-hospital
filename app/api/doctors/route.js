import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { generateId } from '@/lib/utils';

/**
 * GET: Fetch all doctors (Public)
 */
export async function GET() {
  try {
    const doctors = await queryD1(`
      SELECT d.*, dept.name AS department_name
      FROM doctors d
      LEFT JOIN departments dept ON d.department_id = dept.id
      ORDER BY d.name ASC
    `);
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Fetch doctors API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Create a new doctor user and record (Admin only)
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, email, password, speciality, experience, phone, department_id, photo_r2_key } = await request.json();

    if (!name || !email || !password || !department_id) {
      return NextResponse.json(
        { error: 'Name, email, password, and department are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await queryD1First('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return NextResponse.json({ error: 'Account with this email already exists' }, { status: 409 });
    }

    const userId = generateId();
    const doctorId = generateId();
    const passHash = await hashPassword(password);

    // Insert user record
    await queryD1(`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (?, ?, ?, ?, 'doctor')
    `, [userId, name.trim(), email.toLowerCase().trim(), passHash]);

    // Insert doctor record
    await queryD1(`
      INSERT INTO doctors (id, user_id, name, speciality, experience, phone, department_id, photo_r2_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      doctorId,
      userId,
      name.trim(),
      speciality ? speciality.trim() : null,
      experience ? experience.trim() : null,
      phone ? phone.trim() : null,
      department_id,
      photo_r2_key || null,
    ]);

    return NextResponse.json({ success: true, doctorId });
  } catch (error) {
    console.error('Create doctor API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
