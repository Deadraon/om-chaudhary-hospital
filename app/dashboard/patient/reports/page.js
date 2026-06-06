import PatientReportsClient from './PatientReportsClient';
import { queryD1 } from '@/lib/d1';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Lab Reports | Hospital Portal',
};

export default async function PatientReportsPage() {
  let reports = [];

  try {
    const headerList = headers();
    const userId = headerList.get('x-user-id') || '';

    // Fetch lab reports associated with the patient linked to this user ID
    reports = await queryD1(`
      SELECT lr.*
      FROM lab_reports lr
      JOIN patients p ON lr.patient_id = p.id
      WHERE p.user_id = ?
      ORDER BY lr.uploaded_at DESC
    `, [userId]);
  } catch (error) {
    console.error('Failed to load patient lab reports data:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Lab & Diagnostics Reports</h2>
        <p className="text-gray-500 text-xs mt-0.5">Download your laboratory results, blood works, imaging files, and discharge notes.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <PatientReportsClient reports={reports} />
      </div>
    </div>
  );
}
