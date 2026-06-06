'use client';

import { useState } from 'react';
import Link from 'next/link';
import Toast from '@/components/Toast';

export default function ReceptionistOverviewClient({ stats = {}, initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

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
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        setToast({
          message: `Appointment successfully ${newStatus === 'confirmed' ? 'confirmed' : 'cancelled'}. Patient notified by SMS.`,
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

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Appointments */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl text-primary-600">
            🗒️
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Total Appointments</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total || 0}</h3>
          </div>
        </div>

        {/* Confirmed Today */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl text-emerald-600">
            📅
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Today's Scheduled Visits</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.todayCount || 0}</h3>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center gap-4 ring-2 ring-amber-500/10 bg-amber-50/5">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl text-amber-600 animate-pulse">
            ⏳
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Pending Requests</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.pending || 0}</h3>
          </div>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/receptionist/book" className="bg-white hover:bg-slate-50 border border-gray-100 p-6 rounded-3xl shadow-sm block transition-all duration-200">
          <span className="text-3xl">➕</span>
          <h3 className="text-base font-bold text-gray-900 mt-3">Book Walk-In Patient</h3>
          <p className="text-gray-500 text-xs mt-1">Book an appointment manually for patient calls or walk-ins.</p>
        </Link>
        <Link href="/dashboard/receptionist/appointments" className="bg-white hover:bg-slate-50 border border-gray-100 p-6 rounded-3xl shadow-sm block transition-all duration-200">
          <span className="text-3xl">🗒️</span>
          <h3 className="text-base font-bold text-gray-900 mt-3">View All Appointments</h3>
          <p className="text-gray-500 text-xs mt-1">Check today's full consultation agenda, cancel visits, and assign doctors.</p>
        </Link>
      </div>

      {/* Pending appointments table */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pending Requests</h2>
            <p className="text-gray-500 text-xs mt-0.5">Visits waiting for confirmation and doctor allocation.</p>
          </div>
          <Link href="/dashboard/receptionist/appointments" className="text-primary-600 hover:text-primary-700 text-xs font-bold">
            View All
          </Link>
        </div>

        {appointments.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Preferred Doctor</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="font-semibold text-gray-900">{apt.patient_name}</td>
                    <td>{apt.phone}</td>
                    <td>{apt.department_name || 'General'}</td>
                    <td>{apt.doctor_name ? `Dr. ${apt.doctor_name}` : 'Any Available'}</td>
                    <td>{apt.preferred_date ? new Date(apt.preferred_date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}</td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          disabled={updatingId !== null}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-250 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                          disabled={updatingId !== null}
                          className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-250 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
              🎉
            </div>
            <p className="font-medium text-sm text-gray-900">All caught up!</p>
            <p className="text-xs text-gray-500 mt-0.5">No pending appointments to approve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
