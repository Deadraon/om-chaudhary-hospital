import StaffReportsClient from '@/components/StaffReportsClient';
import { queryD1 } from '@/lib/d1';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manage Lab Reports | Hospital Portal',
};

export default async function ReceptionistLabReportsPage() {
  let reports = [];

  try {
    reports = await queryD1(`
      SELECT lr.*, p.name AS patient_name, p.phone AS patient_phone
      FROM lab_reports lr
      JOIN patients p ON lr.patient_id = p.id
      ORDER BY lr.uploaded_at DESC
    `);
  } catch (error) {
    console.error('Failed to load lab reports data for receptionist:', error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Lab Reports Desk</h2>
        <p className="text-gray-500 text-xs mt-0.5">Upload, download, or search laboratory files and discharge sheets for patients.</p>
      </div>

      <StaffReportsClient initialReports={reports} />
    </div>
  );
}
