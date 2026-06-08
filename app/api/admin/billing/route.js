import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getAuthCookie, verifyToken, getCurrentUser } from '@/lib/auth';
import { generateId, now } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/**
 * GET: Retrieve all invoices (Admin/Staff only)
 */
export async function GET(request) {
  try {
    // Use JWT-only auth for reads — bypasses KV session check which can fail silently
    const token = getAuthCookie(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const currentUser = verifyToken(token);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    let query = `
      SELECT inv.*, 
        COALESCE(p.name, 'Unknown Patient') AS patient_name, 
        p.phone AS patient_phone
      FROM invoices inv
      LEFT JOIN patients p ON inv.patient_id = p.id
    `;
    const params = [];

    if (patientId) {
      query += ` WHERE inv.patient_id = ?`;
      params.push(patientId);
    }

    if (status) {
      query += patientId ? ` AND inv.payment_status = ?` : ` WHERE inv.payment_status = ?`;
      params.push(status);
    }

    query += ` ORDER BY inv.created_at DESC`;

    const invoices = await queryD1(query, params);
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Fetch invoices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST: Create a new invoice (Admin/Staff only)
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isStaff = ['super_admin', 'receptionist', 'doctor'].includes(currentUser.role);
    if (!isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patient_id, appointment_id, type, items, subtotal, tax, discount, total_amount, payment_status, due_date } = await request.json();

    if (!patient_id || !type || !items || items.length === 0 || total_amount === undefined) {
      return NextResponse.json(
        { error: 'Patient, type, items, and total amount are required' },
        { status: 400 }
      );
    }

    // Verify patient profile
    const patient = await queryD1First('SELECT id FROM patients WHERE id = ?', [patient_id]);
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }

    // Generate readable invoice number: INV-YYYYMMDD-XXXX (last 4 of random ID)
    const id = generateId();
    const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomPart = id.slice(-4).toUpperCase();
    const invoiceNumber = `INV-${datePart}-${randomPart}`;

    const timestamp = now();

    await queryD1(`
      INSERT INTO invoices (id, patient_id, appointment_id, invoice_number, type, items, subtotal, tax, discount, total_amount, payment_status, created_at, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      patient_id,
      appointment_id || null,
      invoiceNumber,
      type,
      JSON.stringify(items),
      subtotal || total_amount,
      tax || 0,
      discount || 0,
      total_amount,
      payment_status || 'pending',
      timestamp,
      due_date || null
    ]);

    return NextResponse.json({ success: true, invoiceId: id, invoiceNumber });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
