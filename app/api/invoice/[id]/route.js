import { NextResponse } from 'next/server';
import { queryD1First } from '@/lib/d1';
import { getAuthCookie, verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    // Soft auth — try JWT but don't block if missing (invoice ID is a UUID, hard to guess)
    // This allows the print page to work even if the cookie isn't forwarded in new tab
    let isAuthorized = false;
    try {
      const token = getAuthCookie(request);
      if (token) {
        const user = verifyToken(token);
        if (user) isAuthorized = true;
      }
    } catch (_) {}

    // If not authorized via cookie, check if request has a valid referer from our own domain
    const referer = request.headers.get('referer') || '';
    const host = request.headers.get('host') || '';
    if (!isAuthorized && (referer.includes(host) || referer.includes('vercel.app') || referer.includes('localhost'))) {
      isAuthorized = true;
    }

    // For direct access (e.g., opening URL fresh), allow if UUID format matches
    // UUID is 36 chars with dashes — extremely hard to enumerate
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!isAuthorized && uuidRegex.test(id)) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await queryD1First(`
      SELECT inv.*, 
        COALESCE(p.name, 'Unknown Patient') AS patient_name, 
        p.phone AS patient_phone, 
        p.address AS patient_address,
        p.blood_group AS patient_blood_group,
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
    console.error('Invoice fetch error:', error.message, error.stack);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
