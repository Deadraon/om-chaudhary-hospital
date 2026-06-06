'use client';

import { useState } from 'react';

export default function StatusLookup() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState(null);
  const [error, setError] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    setError(null);
    setAppointments(null);

    try {
      // Fetch appointment statuses by phone
      const res = await fetch(`/api/appointments?phone=${phone}`);
      const data = await res.json();

      if (res.ok) {
        setAppointments(data);
      } else {
        setError(data.error || 'Failed to fetch appointment status. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
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
      {/* Search form */}
      <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm max-w-xl mx-auto">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label htmlFor="lookup-phone" className="input-label text-center block mb-2">
              Enter Your Registered Phone Number
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="tel"
                id="lookup-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="input-field text-center font-semibold text-lg tracking-wider"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3.5 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching...
                  </span>
                ) : (
                  'Check Status'
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-650 text-sm font-semibold text-center">{error}</p>}
        </form>
      </div>

      {/* Results */}
      {appointments !== null && (
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-gray-900 text-center">
            Found {appointments.length} {appointments.length === 1 ? 'Appointment' : 'Appointments'}
          </h2>

          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                    <div>
                      <p className="text-gray-400 text-xs">APPOINTMENT ID</p>
                      <p className="text-gray-900 font-mono font-bold text-sm">{apt.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[apt.status] || 'bg-gray-50 text-gray-750 border-gray-200'}`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Patient Name</p>
                      <p className="text-gray-900 font-semibold text-sm">{apt.patient_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Department</p>
                      <p className="text-gray-900 font-semibold text-sm">{apt.department_name || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Preferred Date</p>
                      <p className="text-gray-900 font-semibold text-sm">
                        {apt.preferred_date ? new Date(apt.preferred_date).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {apt.doctor_name && (
                    <div className="mt-4 p-3 bg-gray-50/50 rounded-xl flex items-center gap-2">
                      <span className="text-sm">👨‍⚕️</span>
                      <p className="text-gray-700 text-xs">
                        Assigned Doctor: <span className="font-semibold text-gray-900">Dr. {apt.doctor_name}</span> ({apt.doctor_speciality || 'General'})
                      </p>
                    </div>
                  )}

                  {apt.message && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-xs mb-0.5">Reason / Message</p>
                      <p className="text-gray-650 text-xs italic">&ldquo;{apt.message}&rdquo;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white text-center py-12 rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🗓️
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No appointments found</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">
                We couldn't find any appointment registered with this mobile number.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
