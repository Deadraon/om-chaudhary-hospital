import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromR2 } from '@/lib/r2';

/**
 * DELETE: Delete a lab report (Staff only)
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get report record
    const report = await queryD1First('SELECT * FROM lab_reports WHERE id = ?', [id]);
    if (!report) {
      return NextResponse.json({ error: 'Lab report not found' }, { status: 404 });
    }

    // Delete file from R2
    if (report.r2_file_key) {
      try {
        await deleteFromR2(report.r2_file_key);
      } catch (r2Err) {
        console.error('Failed to delete report file from R2:', r2Err.message);
      }
    }

    // Delete record from D1
    await queryD1('DELETE FROM lab_reports WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete lab report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
