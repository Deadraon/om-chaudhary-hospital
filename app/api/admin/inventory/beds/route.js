import { NextResponse } from 'next/server';
import { queryD1 } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !['super_admin', 'receptionist'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const beds = await queryD1('SELECT * FROM hospital_beds ORDER BY ward_name ASC, bed_number ASC');
    return NextResponse.json(beds);
  } catch (error) {
    console.error('Fetch beds error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !['super_admin', 'receptionist'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, patient_name } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Id and status are required' }, { status: 400 });
    }

    const admitted_at = status === 'Occupied' ? new Date().toISOString().slice(0, 10) : null;
    const finalPatientName = status === 'Occupied' ? (patient_name || 'Anonymous Patient') : null;

    await queryD1(
      'UPDATE hospital_beds SET status = ?, patient_name = ?, admitted_at = ? WHERE id = ?',
      [status, finalPatientName, admitted_at, id]
    );

    return NextResponse.json({ success: true, id, status, patient_name: finalPatientName, admitted_at });
  } catch (error) {
    console.error('Update bed status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
