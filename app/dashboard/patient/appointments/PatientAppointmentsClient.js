'use client';

import DataTable from '@/components/DataTable';

export default function PatientAppointmentsClient({ appointments = [] }) {
  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: false,
      render: (val) => <span className="font-mono text-xs font-bold text-gray-400">{val.slice(0, 8).toUpperCase()}</span>,
    },
    {
      key: 'department_name',
      label: 'Department',
      sortable: true,
    },
    {
      key: 'doctor_name',
      label: 'Doctor Assigned',
      sortable: true,
      render: (val, row) => (
        <span>
          {val ? `Dr. ${val} (${row.doctor_speciality || 'Specialist'})` : 'Waiting Allocation'}
        </span>
      ),
    },
    {
      key: 'preferred_date',
      label: 'Scheduled Date',
      sortable: true,
      render: (val) => (
        <span className="text-sm font-semibold">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full border ${statusColors[val] || 'bg-gray-50 text-gray-700'}`}>
          {val.charAt(0).toUpperCase() + val.slice(1)}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Reason / Concern',
      sortable: false,
      render: (val) => <span className="text-gray-500 text-xs italic block max-w-xs truncate">{val || '-'}</span>,
    },
  ];

  return <DataTable columns={columns} data={appointments} searchable={true} pageSize={10} />;
}
