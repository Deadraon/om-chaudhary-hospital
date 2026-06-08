import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET: Retrieve personal billing list (Patient only)
 */
export async function GET(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'patient') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Resolve patient record linked to the user account
    const patient = await queryD1First('SELECT id FROM patients WHERE user_id = ?', [currentUser.userId]);
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    const invoices = await queryD1(`
      SELECT *
      FROM invoices
      WHERE patient_id = ?
      ORDER BY created_at DESC
    `, [patient.id]);

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Fetch patient billing list error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
