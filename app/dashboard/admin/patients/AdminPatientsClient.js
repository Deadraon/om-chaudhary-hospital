'use client';

import DataTable from '@/components/DataTable';
import Link from 'next/link';

export default function AdminPatientsClient({ patients = [] }) {
  const columns = [
    {
      key: 'name',
      label: 'Patient Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <Link href={`/dashboard/admin/patients/${row.id}`} className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
            {val}
          </Link>
          <p className="text-gray-455 text-xs mt-0.5">UID: {row.id.slice(0, 8).toUpperCase()}</p>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email Address',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      sortable: false,
      render: (val) => <span className="text-sm font-medium">{val || '-'}</span>,
    },
    {
      key: 'dob',
      label: 'Date of Birth',
      sortable: true,
      render: (val) => <span className="text-sm">{val || '-'}</span>,
    },
    {
      key: 'blood_group',
      label: 'Blood Group',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-md border ${
          val 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-gray-50 text-gray-500 border-gray-200'
        }`}>
          {val || 'N/A'}
        </span>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      sortable: false,
      render: (val) => <span className="text-xs text-gray-600 max-w-xs block truncate">{val || '-'}</span>,
    },
  ];

  return <DataTable columns={columns} data={patients} searchable={true} pageSize={10} />;
}
