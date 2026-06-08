import { NextResponse } from 'next/server';
import { queryD1, queryD1First } from '@/lib/d1';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET: Retrieve single invoice
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await queryD1First(`
      SELECT inv.*, p.name AS patient_name, p.phone AS patient_phone, p.address AS patient_address, u.email AS patient_email
      FROM invoices inv
      JOIN patients p ON inv.patient_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE inv.id = ?
    `, [id]);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Security: Patient can only view their own invoices
    if (currentUser.role === 'patient') {
      const patient = await queryD1First('SELECT id FROM patients WHERE user_id = ?', [currentUser.userId]);
      if (!patient || patient.id !== invoice.patient_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Fetch invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH: Update payment status of an invoice (Admin/Staff only)
 */
export async function PATCH(request, { params }) {
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

    const { payment_status } = await request.json();
    if (!payment_status || !['paid', 'pending', 'partial'].includes(payment_status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    // Verify invoice exists
    const invoice = await queryD1First('SELECT id FROM invoices WHERE id = ?', [id]);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    await queryD1('UPDATE invoices SET payment_status = ? WHERE id = ?', [payment_status, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE: Remove an invoice (Admin/Staff only)
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

    const invoice = await queryD1First('SELECT id FROM invoices WHERE id = ?', [id]);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    await queryD1('DELETE FROM invoices WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
