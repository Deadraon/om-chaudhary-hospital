'use client';

import { useState } from 'react';
import { getR2Url } from '@/lib/r2';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export default function PatientDetailClient({
  patient,
  initialAppointments = [],
  initialLabReports = [],
  initialDischargeSummaries = [],
}) {
  const [appointments] = useState(initialAppointments);
  const [labReports, setLabReports] = useState(initialLabReports);
  const [dischargeSummaries, setDischargeSummaries] = useState(initialDischargeSummaries);

  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Modal control states
  const [dischargeModalOpen, setDischargeModalOpen] = useState(false);
  const [dischargeForm, setDischargeForm] = useState({ notes: '' });
  const [dischargeFile, setDischargeFile] = useState(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ title: '' });
  const [reportFile, setReportFile] = useState(null);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  const handleDischargeSubmit = async (e) => {
    e.preventDefault();
    if (!dischargeFile) {
      setToast({ message: 'Please select a file to upload.', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      // 1. Upload file to R2
      const uploadData = new FormData();
      uploadData.append('file', dischargeFile);
      uploadData.append('folder', 'discharge_summaries');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadResult.error || 'Failed to upload report');
      }

      // 2. Save summary detail in DB
      const res = await fetch('/api/patients/discharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patient.id,
          r2_file_key: uploadResult.key,
          notes: dischargeForm.notes,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setDischargeSummaries(prev => [
          {
            id: result.dischargeId,
            patient_id: patient.id,
            r2_file_key: uploadResult.key,
            notes: dischargeForm.notes,
            uploaded_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setToast({ message: 'Discharge summary uploaded successfully. Patient notified.', type: 'success' });
        setDischargeModalOpen(false);
        setDischargeForm({ notes: '' });
        setDischargeFile(null);
      } else {
        setToast({ message: result.error || 'Failed to save record.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.message || 'An error occurred.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportFile) {
      setToast({ message: 'Please select a file to upload.', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      // 1. Upload file to R2
      const uploadData = new FormData();
      uploadData.append('file', reportFile);
      uploadData.append('folder', 'lab_reports');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadResult.error || 'Failed to upload file');
      }

      // 2. Save report detail in DB
      const res = await fetch('/api/lab-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patient.id,
          title: reportForm.title,
          r2_file_key: uploadResult.key,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setLabReports(prev => [
          {
            id: result.reportId,
            patient_id: patient.id,
            r2_file_key: uploadResult.key,
            title: reportForm.title,
            uploaded_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        setToast({ message: 'Lab report uploaded successfully. Patient notified.', type: 'success' });
        setReportModalOpen(false);
        setReportForm({ title: '' });
        setReportFile(null);
      } else {
        setToast({ message: result.error || 'Failed to save record.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.message || 'An error occurred.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Appointment History Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <h4 className="font-bold text-gray-800 text-sm mb-4">Appointment History</h4>
        {appointments.length === 0 ? (
          <p className="text-gray-400 text-xs italic py-4">No appointment history found for this patient.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Doctor</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="px-4 py-3 font-semibold text-gray-700">
                      {new Date(apt.preferred_date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-3">
                      {apt.doctor_name ? (
                        <div>
                          <p className="font-semibold text-gray-800">Dr. {apt.doctor_name}</p>
                          <p className="text-gray-450 text-[10px]">{apt.doctor_speciality}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[apt.status] || 'bg-gray-50 text-gray-700'}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-505 italic max-w-xs truncate" title={apt.message}>
                      {apt.message || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grid for Lab Reports & Discharge Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Reports Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800 text-sm">Lab Reports</h4>
              <button
                onClick={() => setReportModalOpen(true)}
                className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 rounded-xl text-[10px] font-bold transition-all"
              >
                + Upload Report
              </button>
            </div>
            {labReports.length === 0 ? (
              <p className="text-gray-400 text-xs italic py-4">No lab reports uploaded.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {labReports.map((rep) => {
                  const downloadUrl = getR2Url(rep.r2_file_key);
                  return (
                    <div key={rep.id} className="flex justify-between items-center p-2.5 rounded-xl border border-gray-50 bg-gray-50/50">
                      <div className="overflow-hidden pr-2">
                        <p className="font-semibold text-xs text-gray-800 truncate" title={rep.title}>{rep.title}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">
                          {new Date(rep.uploaded_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </p>
                      </div>
                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-primary-50 text-primary-750 hover:bg-primary-100 rounded-lg text-[10px] font-bold transition-colors flex-shrink-0"
                      >
                        View 📎
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Discharge Summaries Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800 text-sm">Discharge Summaries</h4>
              <button
                onClick={() => setDischargeModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-bold transition-all"
              >
                + Upload Summary
              </button>
            </div>
            {dischargeSummaries.length === 0 ? (
              <p className="text-gray-400 text-xs italic py-4">No discharge summary records found.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {dischargeSummaries.map((disc) => {
                  const downloadUrl = getR2Url(disc.r2_file_key);
                  return (
                    <div key={disc.id} className="p-3 rounded-xl border border-gray-50 bg-gray-50/50 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-xs text-gray-800">Discharge Report</p>
                          <p className="text-gray-450 text-[10px] mt-0.5">
                            {new Date(disc.uploaded_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </p>
                        </div>
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-750 hover:bg-emerald-100 rounded-lg text-[10px] font-bold transition-colors"
                        >
                          Download 📥
                        </a>
                      </div>
                      {disc.notes && (
                        <p className="text-gray-500 text-[10px] italic border-t border-gray-100 pt-1.5 line-clamp-2" title={disc.notes}>
                          Note: {disc.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discharge Summary Upload Modal */}
      {dischargeModalOpen && (
        <Modal
          isOpen={dischargeModalOpen}
          onClose={() => setDischargeModalOpen(false)}
          title="Upload Patient Discharge Summary"
        >
          <form onSubmit={handleDischargeSubmit} className="space-y-4">
            <div>
              <label htmlFor="discharge-file" className="input-label">Select Report File (PDF/Image) *</label>
              <input
                id="discharge-file"
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setDischargeFile(e.target.files?.[0] || null)}
                required
                className="input-field text-xs py-1.5"
              />
            </div>
            <div>
              <label htmlFor="discharge-notes" className="input-label">Physician Notes / Instructions</label>
              <textarea
                id="discharge-notes"
                value={dischargeForm.notes}
                onChange={(e) => setDischargeForm({ notes: e.target.value })}
                rows={3}
                placeholder="Enter discharge instructions, medication advice, or follow-up details..."
                className="input-field text-xs py-2 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDischargeModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Saving Summary...' : 'Save & Notify Patient'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Lab Report Upload Modal */}
      {reportModalOpen && (
        <Modal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          title="Upload Lab Report Document"
        >
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <div>
              <label htmlFor="report-title" className="input-label">Report Title / Description *</label>
              <input
                id="report-title"
                type="text"
                value={reportForm.title}
                onChange={(e) => setReportForm({ title: e.target.value })}
                required
                placeholder="e.g. Complete Blood Count (CBC)"
                className="input-field text-xs py-2"
              />
            </div>
            <div>
              <label htmlFor="report-file" className="input-label">Select Report File (PDF/Image) *</label>
              <input
                id="report-file"
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                required
                className="input-field text-xs py-1.5"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Save & Notify Patient'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
