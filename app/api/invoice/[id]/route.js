import { NextResponse } from 'next/server';
import { queryD1First } from '@/lib/d1';
import { getAuthCookie, verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    // JWT-only auth — no KV needed for reading invoice
    const token = getAuthCookie(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const currentUser = verifyToken(token);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const invoice = await queryD1First(`
      SELECT inv.*, 
        COALESCE(p.name, 'Unknown Patient') AS patient_name, 
        p.phone AS patient_phone, 
        p.address AS patient_address, 
        p.age AS patient_age,
        p.gender AS patient_gender,
        u.email AS patient_email
      FROM invoices inv
      LEFT JOIN patients p ON inv.patient_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE inv.id = ?
    `, [id]);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
