'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';

export default function StaffAttendanceClient({ initialLogs = [] }) {
  const [logs] = useState(initialLogs);

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    try {
      const [h1, m1, s1 = 0] = checkIn.split(':').map(Number);
      const [h2, m2, s2 = 0] = checkOut.split(':').map(Number);
      const diffMs = (h2 * 3600 + m2 * 60 + s2) - (h1 * 3600 + m1 * 60 + s1);
      if (diffMs <= 0) return '0.0 hr';
      const hours = diffMs / 3600;
      return `${hours.toFixed(1)} hrs`;
    } catch (e) {
      return '-';
    }
  };

  const statusColors = {
    present: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    absent: 'bg-red-50 text-red-700 border-red-100',
    half_day: 'bg-amber-50 text-amber-700 border-amber-100',
    on_leave: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  // Calculate statistics
  const presentDays = logs.filter(l => l.status === 'present').length;
  const halfDays = logs.filter(l => l.status === 'half_day').length;
  const onLeave = logs.filter(l => l.status === 'on_leave').length;

  const totalWorkingDays = presentDays + halfDays;

  // Calculate average hours
  let averageHours = 0;
  if (totalWorkingDays > 0) {
    let totalMinutes = 0;
    let countedDays = 0;
    logs.forEach(l => {
      if (l.check_in && l.check_out) {
        const [h1, m1] = l.check_in.split(':').map(Number);
        const [h2, m2] = l.check_out.split(':').map(Number);
        const diffMin = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diffMin > 0) {
          totalMinutes += diffMin;
          countedDays++;
        }
      }
    });
    if (countedDays > 0) {
      averageHours = (totalMinutes / 60) / countedDays;
    }
  }

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) => <span className="font-bold text-gray-900">{val}</span>,
    },
    {
      key: 'check_in',
      label: 'Check In',
      render: (val) => <span className="text-gray-900 font-semibold text-xs">{val || '--:--'}</span>,
    },
    {
      key: 'check_out',
      label: 'Check Out',
      render: (val) => <span className="text-gray-900 font-semibold text-xs">{val || '--:--'}</span>,
    },
    {
      key: 'duration',
      label: 'Shift Hours',
      render: (_, row) => (
        <span className="text-gray-500 font-medium text-xs">
          {calculateHours(row.check_in, row.check_out)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${statusColors[val] || 'bg-gray-50 text-gray-550'}`}>
          {val.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'notes',
      label: 'Remarks / Notes',
      render: (val) => <span className="text-xs text-gray-500">{val || '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Days Worked</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{presentDays} Days</h3>
          </div>
          <span className="text-2xl p-2 bg-emerald-50 text-emerald-500 rounded-2xl">⚡</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Half Days Worked</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{halfDays} Days</h3>
          </div>
          <span className="text-2xl p-2 bg-amber-50 text-amber-500 rounded-2xl">🌗</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Approved Leaves</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{onLeave} Days</h3>
          </div>
          <span className="text-2xl p-2 bg-slate-50 text-slate-400 rounded-2xl">🌴</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average Hours/Day</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{averageHours.toFixed(1)} hrs</h3>
          </div>
          <span className="text-2xl p-2 bg-indigo-50 text-indigo-500 rounded-2xl">⏱</span>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={logs} searchable={true} pageSize={10} />
      </div>
    </div>
  );
}
