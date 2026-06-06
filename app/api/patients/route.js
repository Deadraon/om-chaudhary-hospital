import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

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
