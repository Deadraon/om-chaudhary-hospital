'use client';

import { useState } from 'react';

export default function AppointmentForm({ departments = [], doctors = [] }) {
  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    department_id: '',
    doctor_id: '',
    preferred_date: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const filteredDoctors = formData.department_id
    ? doctors.filter(d => d.department_id === formData.department_id)
    : doctors;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset doctor when department changes
      ...(name === 'department_id' ? { doctor_id: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: 'Appointment booked successfully! You will receive a confirmation SMS shortly.' });
        setFormData({
          patient_name: '',
          phone: '',
          department_id: '',
          doctor_id: '',
          preferred_date: '',
          message: '',
        });
      } else {
        setResult({ success: false, message: data.error || 'Failed to book appointment' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Result Message */}
      {result && (
        <div className={`p-4 rounded-xl text-sm font-medium ${
          result.success
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {result.message}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Name */}
        <div>
          <label htmlFor="patient_name" className="input-label">Full Name *</label>
          <input
            type="text"
            id="patient_name"
            name="patient_name"
            value={formData.patient_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="input-label">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter 10-digit mobile number"
            pattern="[0-9]{10}"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department_id" className="input-label">Department *</label>
          <select
            id="department_id"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label htmlFor="doctor_id" className="input-label">Preferred Doctor</label>
          <select
            id="doctor_id"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Any Available Doctor</option>
            {filteredDoctors.map(doc => (
              <option key={doc.id} value={doc.id}>Dr. {doc.name} — {doc.speciality}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="preferred_date" className="input-label">Preferred Date *</label>
          <input
            type="date"
            id="preferred_date"
            name="preferred_date"
            value={formData.preferred_date}
            onChange={handleChange}
            className="input-field"
            min={today}
            required
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="input-label">Additional Message</label>
          <input
            type="text"
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="input-field"
            placeholder="Any specific concern or request"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Booking...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Appointment
          </span>
        )}
      </button>
    </form>
  );
}
