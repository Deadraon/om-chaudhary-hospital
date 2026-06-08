import AdminBillingClient from './AdminBillingClient';
import { queryD1 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Billing & Invoices Management | Hospital Portal',
};

export default async function AdminBillingPage() {
  let invoices = [];
  let patients = [];
  let appointments = [];

  try {
    // Fetch all invoices
    invoices = await queryD1(`
      SELECT inv.*, p.name AS patient_name, p.phone AS patient_phone
      FROM invoices inv
      JOIN patients p ON inv.patient_id = p.id
      ORDER BY inv.created_at DESC
    `);

    // Fetch patients for invoice generator dropdown
    patients = await queryD1(`
      SELECT id, name, phone, address FROM patients ORDER BY name ASC
    `);

    // Fetch confirmed/completed appointments to link with invoices optionally
    appointments = await queryD1(`
      SELECT a.id, a.patient_name, a.preferred_date, d.name AS doctor_name, a.phone
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.preferred_date DESC
    `);
  } catch (error) {
    console.error('Failed to load admin billing data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Billing & Invoices</h2>
        <p className="text-gray-500 text-xs mt-0.5">Generate invoices for OPD / IPD visits, compile itemized fees, and track receipts.</p>
      </div>

      <AdminBillingClient
        initialInvoices={invoices}
        patients={patients}
        appointments={appointments}
      />
    </div>
  );
}
