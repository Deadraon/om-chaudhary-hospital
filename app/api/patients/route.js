import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isPrivileged = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isPrivileged) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const patients = await queryD1(`
      SELECT p.*, u.email
      FROM patients p
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.name ASC
    `);

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Fetch patients API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Quick-add a walk-in patient (admin/receptionist only)
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isPrivileged = ['super_admin', 'receptionist'].includes(currentUser.role);
    if (!isPrivileged) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, phone, age, gender, address } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }

    const id = randomUUID();

    await queryD1(
      `INSERT INTO patients (id, name, phone, age, gender, address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [id, name.trim(), phone.trim(), age || null, gender || 'Male', address || null]
    );

    return NextResponse.json({ id, name, phone }, { status: 201 });
  } catch (error) {
    console.error('Create patient API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
