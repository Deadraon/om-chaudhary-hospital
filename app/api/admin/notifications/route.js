import { NextResponse } from 'next/server';
import { queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !['super_admin', 'receptionist'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pendingAppointments = await queryD1First("SELECT COUNT(*) AS count FROM appointments WHERE status = 'pending'");
    const pendingOpinions = await queryD1First("SELECT COUNT(*) AS count FROM second_opinions WHERE status = 'pending'");
    const patientsToday = await queryD1First("SELECT COUNT(*) AS count FROM users WHERE role = 'patient' AND date(created_at) = date('now')");

    return NextResponse.json({
      appointments: pendingAppointments?.count || 0,
      opinions: pendingOpinions?.count || 0,
      patientsToday: patientsToday?.count || 0,
    });
  } catch (error) {
    console.error('Fetch notifications count error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
