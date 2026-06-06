'use client';

import { useState } from 'react';
import Toast from '@/components/Toast';

export default function DoctorOverviewClient({ stats = {}, initialAppointments = [] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const handleComplete = async (id) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppointments(prev =>
          prev.map(apt => (apt.id === id ? { ...apt, status: 'completed' } : apt))
        );
        setToast({ message: 'Appointment marked as completed.', type: 'success' });
      } else {
        setToast({ message: data.error || 'Failed to update appointment.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Appointments */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl text-primary-600">
            🗒️
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">All Consultations</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total || 0}</h3>
          </div>
        </div>

        {/* Confirmed / Today */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600">
            📅
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Confirmed Scheduled</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">{stats.confirmed || 0}</h3>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl text-amber-600">
            ⏳
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Pending Approvals</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.pending || 0}</h3>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl text-emerald-600">
            ✅
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold">Completed Consults</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed || 0}</h3>
          </div>
        </div>
      </div>

      {/* Today's schedule grid list */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 text-base mb-6">Upcoming Scheduled Consultations</h3>

        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50/50 transition-colors gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">{apt.patient_name}</h4>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${statusColors[apt.status] || 'bg-gray-50'}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-medium">Contact: {apt.phone}</p>
                  <p className="text-gray-400 text-[10px]">Preferred Date: {new Date(apt.preferred_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                  {apt.message && <p className="text-gray-550 text-xs italic mt-1">&ldquo;{apt.message}&rdquo;</p>}
                </div>

                <div className="flex items-center gap-2">
                  {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                    <button
                      onClick={() => handleComplete(apt.id)}
                      disabled={updatingId === apt.id}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {updatingId === apt.id ? 'Updating...' : 'Mark Completed'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
              📅
            </div>
            <p className="font-medium text-sm text-gray-900">No scheduled consultations</p>
            <p className="text-xs text-gray-500 mt-0.5">Your schedule is currently clear.</p>
          </div>
        )}
      </div>
    </div>
  );
}
