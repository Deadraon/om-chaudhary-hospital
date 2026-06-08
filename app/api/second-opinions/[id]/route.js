import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Authenticate
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if second opinion exists
    const record = await queryD1First('SELECT * FROM second_opinions WHERE id = ?', [id]);
    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    if (status !== undefined) {
      const allowedStatuses = ['pending', 'reviewed', 'replied'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
          { status: 400 }
        );
      }

      await queryD1('UPDATE second_opinions SET status = ? WHERE id = ?', [status, id]);
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Update second opinion status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
