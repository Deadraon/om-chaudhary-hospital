'use client';

import { useState } from 'react';
import Toast from '@/components/Toast';
import { getR2Url } from '@/lib/r2';

export default function PatientProfileClient({ initialPatient = {}, initialDischargeSummaries = [] }) {
  const [patient, setPatient] = useState(initialPatient);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    name: patient.name || '',
    phone: patient.phone || '',
    dob: patient.dob || '',
    blood_group: patient.blood_group || '',
    address: patient.address || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setPatient(prev => ({ ...prev, ...formData }));
        setToast({ message: 'Profile updated successfully!', type: 'success' });
        setIsEditing(false);
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-150">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Personal Details</h3>
            <p className="text-gray-500 text-xs">Manage your contact details and hospital registry information.</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary py-2 px-4 text-xs font-bold"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label htmlFor="pt-form-name" className="input-label">Full Name *</label>
                <input
                  type="text"
                  id="pt-form-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field text-xs py-2"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="input-label">Email Address (Login Username)</label>
                <input
                  type="email"
                  value={patient.email || ''}
                  className="input-field text-xs py-2 bg-gray-55/40 text-gray-400 cursor-not-allowed border-gray-100"
                  readOnly
                  disabled
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="pt-form-phone" className="input-label">Phone Number *</label>
                <input
                  type="tel"
                  id="pt-form-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  className="input-field text-xs py-2"
                  pattern="[0-9]{10}"
                  required
                  disabled={loading}
                />
              </div>

              {/* DOB */}
              <div>
                <label htmlFor="pt-form-dob" className="input-label">Date of Birth</label>
                <input
                  type="date"
                  id="pt-form-dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="input-field text-xs py-2"
                  disabled={loading}
                />
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="pt-form-bg" className="input-label">Blood Group</label>
                <select
                  id="pt-form-bg"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  className="input-field text-xs py-2"
                  disabled={loading}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="pt-form-addr" className="input-label">Residential Address</label>
              <textarea
                id="pt-form-addr"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="input-field text-xs py-2 resize-none"
                placeholder="Enter your street address, city, state"
                disabled={loading}
              ></textarea>
            </div>

            {/* Form actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: patient.name || '',
                    phone: patient.phone || '',
                    dob: patient.dob || '',
                    blood_group: patient.blood_group || '',
                    address: patient.address || '',
                  });
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-gray-250 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-5 py-2 text-xs font-bold disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Full Name</p>
              <p className="text-gray-900 font-semibold mt-1">{patient.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Email Address</p>
              <p className="text-gray-900 font-semibold mt-1">{patient.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Phone Number</p>
              <p className="text-gray-900 font-semibold mt-1">{patient.phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Date of Birth</p>
              <p className="text-gray-900 font-semibold mt-1">
                {patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Blood Group</p>
              <p className="text-gray-900 font-semibold mt-1">
                {patient.blood_group ? (
                  <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-100">{patient.blood_group}</span>
                ) : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Residential Address</p>
              <p className="text-gray-900 font-semibold mt-1 leading-relaxed">{patient.address || '-'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Discharge Summaries Section */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="pb-4 border-b border-gray-150 mb-4">
          <h3 className="font-bold text-gray-900 text-base">Discharge Summaries</h3>
          <p className="text-gray-500 text-xs font-semibold mt-0.5">Download discharge reports and instruction notes compiled by your attending doctor.</p>
        </div>

        {initialDischargeSummaries.length === 0 ? (
          <p className="text-gray-400 text-xs italic py-2">No discharge summary records available on your profile.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {initialDischargeSummaries.map((summary) => {
              const downloadUrl = getR2Url(summary.r2_file_key);
              return (
                <div key={summary.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-xs text-gray-900">Discharge Report</p>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {new Date(summary.uploaded_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                    {summary.notes && (
                      <p className="text-gray-500 text-[11px] italic mt-2 border-t border-gray-100/50 pt-2 line-clamp-3">
                        "{summary.notes}"
                      </p>
                    )}
                  </div>
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm self-start"
                  >
                    📥 Download Document
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
