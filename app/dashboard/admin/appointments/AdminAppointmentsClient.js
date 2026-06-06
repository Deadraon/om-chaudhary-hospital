'use client';

import { useState, useMemo } from 'react';
import DataTable from '@/components/DataTable';
import Toast from '@/components/Toast';

export default function AdminAppointmentsClient({ initialAppointments = [], doctors = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Custom Filter States
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');

  const handleUpdate = async (id, field, value) => {
    setUpdatingId(id);
    try {
      const payload = { [field]: value };
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setAppointments(prev =>
          prev.map(apt => {
            if (apt.id === id) {
              const updatedApt = { ...apt, [field]: value };
              // If we updated doctor_id, let's also update doctor_name in the UI list
              if (field === 'doctor_id') {
                const assignedDoc = doctors.find(d => d.id === value);
                updatedApt.doctor_name = assignedDoc ? assignedDoc.name : null;
                updatedApt.doctor_speciality = assignedDoc ? assignedDoc.speciality : null;
              }
              return updatedApt;
            }
            return apt;
          })
        );
        
        setToast({
          message: field === 'status' 
            ? `Appointment status successfully updated to "${value}". Patient notified via SMS.`
            : `Doctor assigned successfully.`,
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

  // Filter local state data before passing to DataTable
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchStatus = statusFilter === '' || apt.status === statusFilter;
      const matchDoctor = doctorFilter === '' || apt.doctor_id === doctorFilter;
      return matchStatus && matchDoctor;
    });
  }, [appointments, statusFilter, doctorFilter]);

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
      key: 'department_name',
      label: 'Department',
      sortable: true,
      render: (val) => <span className="text-sm">{val || 'General'}</span>,
    },
    {
      key: 'doctor_id',
      label: 'Assigned Doctor',
      sortable: false,
      render: (val, row) => {
        // Find doctors in this department specifically, or allow all doctors
        const deptDoctors = row.department_id 
          ? doctors.filter(d => d.department_id === row.department_id)
          : doctors;

        return (
          <select
            value={val || ''}
            onChange={(e) => handleUpdate(row.id, 'doctor_id', e.target.value)}
            disabled={updatingId === row.id}
            className="input-field py-1.5 text-xs w-full max-w-[200px]"
          >
            <option value="">Unassigned / Any</option>
            {deptDoctors.map(doc => (
              <option key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.speciality})</option>
            ))}
          </select>
        );
      },
    },
    {
      key: 'preferred_date',
      label: 'Preferred Date',
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
          onChange={(e) => handleUpdate(row.id, 'status', e.target.value)}
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
      label: 'Message',
      sortable: false,
      render: (val) => <p className="text-gray-500 text-xs italic max-w-xs truncate">{val || '-'}</p>,
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

      {/* Header and custom filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <label htmlFor="admin-apt-status-filter" className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Filter Status</label>
            <select
              id="admin-apt-status-filter"
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

          {/* Doctor Filter */}
          <div className="w-full sm:w-48">
            <label htmlFor="admin-apt-doc-filter" className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Filter Doctor</label>
            <select
              id="admin-apt-doc-filter"
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="input-field py-2 text-xs"
            >
              <option value="">All Doctors</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>Dr. {doc.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-xs font-medium">Total Matches</p>
          <p className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={filteredAppointments} searchable={true} pageSize={10} />
      </div>
    </div>
  );
}
