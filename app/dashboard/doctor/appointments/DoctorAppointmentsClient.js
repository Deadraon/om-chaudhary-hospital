'use client';

import { useState, useMemo } from 'react';
import DataTable from '@/components/DataTable';
import Toast from '@/components/Toast';

export default function DoctorAppointmentsClient({ initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppointments(prev =>
          prev.map(apt => (apt.id === id ? { ...apt, status: newStatus } : apt))
        );
        setToast({
          message: `Appointment status updated to "${newStatus}". Patient notified via SMS.`,
          type: 'success',
        });
      } else {
        setToast({ message: data.error || 'Failed to update appointment.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!statusFilter) return appointments;
    return appointments.filter(apt => apt.status === statusFilter);
  }, [appointments, statusFilter]);

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const columns = [
    {
      key: 'patient_name',
      label: 'Patient Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-900">{val}</p>
          <p className="text-gray-500 text-xs mt-0.5">{row.phone}</p>
        </div>
      ),
    },
    {
      key: 'preferred_date',
      label: 'Appointment Date',
      sortable: true,
      render: (val) => (
        <span className="text-sm font-medium">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val, row) => (
        <select
          value={val}
          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
          disabled={updatingId === row.id}
          className={`px-2 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${statusColors[val] || 'bg-gray-50 text-gray-750'}`}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      key: 'message',
      label: 'Patient Notes',
      sortable: false,
      render: (val) => <span className="text-gray-500 text-xs italic block max-w-sm truncate">{val || '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-48">
          <label htmlFor="doctor-apt-status-filter" className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Filter Status</label>
          <select
            id="doctor-apt-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-2 text-xs"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-xs font-medium font-semibold uppercase tracking-wide">Total Consultations</p>
          <p className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={filteredAppointments} searchable={true} pageSize={10} />
      </div>
    </div>
  );
}
