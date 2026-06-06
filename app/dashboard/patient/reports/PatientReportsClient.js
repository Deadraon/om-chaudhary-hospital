'use client';

import DataTable from '@/components/DataTable';

export default function PatientReportsClient({ reports = [] }) {
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

  return <DataTable columns={columns} data={reports} searchable={true} pageSize={10} />;
}
