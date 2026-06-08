import PatientBillingClient from './PatientBillingClient';
import { queryD1, queryD1First } from '@/lib/d1';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Billing History | Hospital Portal',
};

export default async function PatientBillingPage() {
  let invoices = [];
  let patient = null;

  try {
    const headerList = headers();
    const userId = headerList.get('x-user-id') || '';

    // Retrieve patient record linked to the user account
    patient = await queryD1First(`
      SELECT id FROM patients WHERE user_id = ?
    `, [userId]);

    if (patient) {
      invoices = await queryD1(`
        SELECT *
        FROM invoices
        WHERE patient_id = ?
        ORDER BY created_at DESC
      `, [patient.id]);
    }
  } catch (error) {
    console.error('Failed to load patient billing list:', error.message);
  }

  if (!patient) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-750 p-6 rounded-3xl text-sm font-semibold max-w-xl mx-auto text-center mt-10">
        ⚠️ Profile Not Found. You do not seem to have an active Patient medical record associated with this account.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Billing & Receipts</h2>
        <p className="text-gray-500 text-xs mt-0.5">View transaction summaries, itemized consult fees, and download receipt copies.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <PatientBillingClient invoices={invoices} />
      </div>
    </div>
  );
}
