import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctor_id');

    let sql = 'SELECT * FROM doctor_schedules';
    const params = [];
    if (doctorId) {
      sql += ' WHERE doctor_id = ?';
      params.push(doctorId);
    }

    const schedules = await queryD1(sql, params);
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Fetch doctor schedules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !['super_admin', 'receptionist'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { doctor_id, schedules } = await request.json();

    if (!doctor_id || !Array.isArray(schedules)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Delete existing schedules for this doctor
    await queryD1('DELETE FROM doctor_schedules WHERE doctor_id = ?', [doctor_id]);

    // Insert new schedules
    for (const slot of schedules) {
      const { day_of_week, start_time, end_time, session } = slot;
      if (!day_of_week || !start_time || !end_time || !session) continue;
      
      const id = 'slot-' + Math.random().toString(36).substring(2, 11);
      await queryD1(
        `INSERT INTO doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, session)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, doctor_id, day_of_week, start_time, end_time, session]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save doctor schedules error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
