'use client';

import { useState, useMemo } from 'react';
import DataTable from '@/components/DataTable';
import Toast from '@/components/Toast';
import Modal from '@/components/Modal';

export default function AdminAppointmentsClient({ initialAppointments = [], doctors = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  
  // Custom Filter States
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');

  // Bulk Selection & Rescheduling States
  const [selectedIds, setSelectedIds] = useState([]);
  const [rescheduleApt, setRescheduleApt] = useState(null); // { id, name, date }
  const [rescheduleDate, setRescheduleDate] = useState('');

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
            : field === 'preferred_date'
            ? `Appointment rescheduled successfully. Patient notified via SMS.`
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

  const handleBulkUpdate = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setUpdatingId('bulk');
    let successCount = 0;
    let failCount = 0;

    await Promise.all(
      selectedIds.map(async (id) => {
        try {
          const res = await fetch(`/api/appointments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          });
          if (res.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      })
    );

    setAppointments(prev =>
      prev.map(apt =>
        selectedIds.includes(apt.id)
          ? { ...apt, status: newStatus }
          : apt
      )
    );

    setSelectedIds([]);
    setToast({
      message: `Bulk status update complete. Successfully updated ${successCount} appointments.${failCount > 0 ? ` Failed: ${failCount}` : ''}`,
      type: failCount > 0 ? 'warning' : 'success',
    });
    setUpdatingId(null);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleApt || !rescheduleDate) return;

    await handleUpdate(rescheduleApt.id, 'preferred_date', rescheduleDate);
    setRescheduleApt(null);
    setRescheduleDate('');
  };

  const handleExportCSV = () => {
    const headers = ['Patient Name', 'Phone', 'Department', 'Assigned Doctor', 'Preferred Date', 'Status', 'Message'];
    const rows = filteredAppointments.map(apt => [
      apt.patient_name,
      apt.phone,
      apt.department_name || 'General',
      apt.doctor_name ? `Dr. ${apt.doctor_name}` : 'Unassigned',
      apt.preferred_date ? new Date(apt.preferred_date).toLocaleDateString() : '',
      apt.status,
      apt.message || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `appointments_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter local state data before passing to DataTable
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchStatus = statusFilter === '' || apt.status === statusFilter;
      const matchDoctor = doctorFilter === '' || apt.doctor_id === doctorFilter;
      return matchStatus && matchDoctor;
    });
  }, [appointments, statusFilter, doctorFilter]);

  const columns = [
    {
      key: 'selection',
      label: (
        <input
          type="checkbox"
          checked={filteredAppointments.length > 0 && selectedIds.length === filteredAppointments.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(filteredAppointments.map(a => a.id));
            } else {
              setSelectedIds([]);
            }
          }}
          className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
        />
      ),
      sortable: false,
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(prev => [...prev, row.id]);
            } else {
              setSelectedIds(prev => prev.filter(id => id !== row.id));
            }
          }}
          className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
        />
      ),
    },
    {
      key: 'patient_name',
      label: 'Patient Details',
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
      render: (val) => {
        const colors = {
          pending: 'bg-amber-50 text-amber-700 border-amber-200',
          confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
          completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          cancelled: 'bg-red-50 text-red-700 border-red-200',
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[val] || 'bg-gray-50 text-gray-800 border-gray-200'}`}>
            {val.charAt(0).toUpperCase() + val.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => {
        const isPending = row.status === 'pending';
        const isConfirmed = row.status === 'confirmed';
        
        return (
          <div className="flex flex-wrap gap-1.5 items-center">
            {isPending && (
              <button
                onClick={() => handleUpdate(row.id, 'status', 'confirmed')}
                disabled={updatingId !== null}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Confirm
              </button>
            )}
            {isConfirmed && (
              <button
                onClick={() => handleUpdate(row.id, 'status', 'completed')}
                disabled={updatingId !== null}
                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Complete
              </button>
            )}
            {(isPending || isConfirmed) && (
              <>
                <button
                  onClick={() => handleUpdate(row.id, 'status', 'cancelled')}
                  disabled={updatingId !== null}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setRescheduleApt({ id: row.id, name: row.patient_name, date: row.preferred_date });
                    setRescheduleDate(row.preferred_date || '');
                  }}
                  disabled={updatingId !== null}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  Reschedule
                </button>
              </>
            )}
            {!isPending && !isConfirmed && (
              <span className="text-gray-400 text-xs italic">Closed</span>
            )}
          </div>
        );
      },
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

      {/* Header, Export & Print buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-gray-200"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-gray-200"
          >
            🖨️ Print List
          </button>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-1.5 flex items-center gap-3 animate-fade-in">
            <span className="text-xs text-primary-700 font-semibold">{selectedIds.length} Selected</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => handleBulkUpdate('confirmed')}
                disabled={updatingId !== null}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Bulk Confirm
              </button>
              <button
                onClick={() => handleBulkUpdate('cancelled')}
                disabled={updatingId !== null}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                Bulk Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between no-print">
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

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <Modal
          isOpen={true}
          onClose={() => setRescheduleApt(null)}
          title={`Reschedule Appointment - ${rescheduleApt.name}`}
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-date" className="input-label">Select New Date</label>
              <input
                id="new-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleApt(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors"
              >
                Save Reschedule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
