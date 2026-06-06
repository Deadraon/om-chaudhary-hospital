import DataTable from '@/components/DataTable';
import { queryD1 } from '@/lib/d1';
import { headers } from 'next/headers';

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

  const columns = [
    {
      key: 'title',
      label: 'Report / Document Name',
      sortable: true,
      render: (val) => <span className="font-semibold text-gray-900">{val}</span>,
    },
    {
      key: 'uploaded_at',
      label: 'Date Uploaded',
      sortable: true,
      render: (val) => (
        <span className="text-sm">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
        </span>
      ),
    },
    {
      key: 'r2_file_key',
      label: 'Download Link',
      sortable: false,
      render: (val) => {
        const fileUrl = val
          ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''}/${val}`
          : '#';

        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-750 hover:bg-primary-100 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Report (PDF)
          </a>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Lab & Diagnostics Reports</h2>
        <p className="text-gray-500 text-xs mt-0.5">Download your laboratory results, blood works, imaging files, and discharge notes.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={reports} searchable={true} pageSize={10} />
      </div>
    </div>
  );
}
