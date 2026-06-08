import StaffReportsClient from '@/components/StaffReportsClient';
import { queryD1 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Lab Reports Management | Hospital Portal',
};

export default async function AdminLabReportsPage() {
  let reports = [];

  try {
    // Fetch lab reports joined with patient details
    reports = await queryD1(`
      SELECT lr.*, p.name AS patient_name, p.phone AS patient_phone
      FROM lab_reports lr
      JOIN patients p ON lr.patient_id = p.id
      ORDER BY lr.uploaded_at DESC
    `);
  } catch (error) {
    console.error('Failed to load lab reports data for admin:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Lab Reports Administration</h2>
        <p className="text-gray-500 text-xs mt-0.5">Manage diagnostics and upload files for patients across the hospital.</p>
      </div>

      <StaffReportsClient initialReports={reports} />
    </div>
  );
}
