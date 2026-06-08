'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export default function StaffReportsClient({ initialReports = [] }) {
  const [reports, setReports] = useState(initialReports);
  const [patients, setPatients] = useState([]);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
  });

  // Fetch patient list for report assignment
  useEffect(() => {
    fetch('/api/patients')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPatients(data))
      .catch((err) => console.error('Error fetching patients:', err));
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      patientId: '',
      title: '',
    });
    setFileToUpload(null);
    setPatientSearch('');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      
      // Auto-populate report title from filename if title is blank
      if (!formData.title) {
        const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setFormData(prev => ({ ...prev, title: cleanName.replace(/[-_]/g, ' ') }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload) {
      setToast({ message: 'Please select a file to upload.', type: 'error' });
      return;
    }

    setLoading(true);
    setUploadingFile(true);

    try {
      // Step 1: Upload file to Cloudflare R2
      const uploadData = new FormData();
      uploadData.append('file', fileToUpload);
      uploadData.append('folder', 'lab-reports');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const uploadResult = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadResult.error || 'Failed to upload report file to R2');
      }

      setUploadingFile(false);

      // Step 2: Post database entry in D1
      const payload = {
        patient_id: formData.patientId,
        title: formData.title.trim(),
        r2_file_key: uploadResult.key,
      };

      const res = await fetch('/api/lab-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({
          message: 'Lab report uploaded and assigned successfully!',
          type: 'success',
        });

        // Refresh lab reports list
        const refreshRes = await fetch('/api/lab-reports');
        if (refreshRes.ok) {
          const updatedReports = await refreshRes.json();
          setReports(updatedReports);
        }

        setIsModalOpen(false);
      } else {
        setToast({ message: data.error || 'Failed to create report entry.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
      setUploadingFile(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this lab report? This will delete the file and all database records.')) {
      return;
    }

    try {
      const res = await fetch(`/api/lab-reports/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== id));
        setToast({ message: 'Lab report deleted successfully.', type: 'success' });
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to delete report.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      (p.phone && p.phone.includes(patientSearch)) ||
      (p.email && p.email.toLowerCase().includes(patientSearch.toLowerCase()))
  );

  const columns = [
    {
      key: 'patient_name',
      label: 'Patient Details',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-900 leading-none">{val}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">Phone: {row.patient_phone || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Report Title',
      sortable: true,
      render: (val) => <span className="font-bold text-gray-700 text-sm">{val}</span>,
    },
    {
      key: 'uploaded_at',
      label: 'Date Uploaded',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-gray-650">
          {val ? new Date(val).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
        </span>
      ),
    },
    {
      key: 'r2_file_key',
      label: 'File Access',
      sortable: false,
      render: (val) => {
        const fileUrl = val
          ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''}/${val}`
          : '#';

        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-750 hover:text-primary-800 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Open Report (PDF)
          </a>
        );
      },
    },
    {
      key: 'id',
      label: 'Action',
      sortable: false,
      render: (val) => (
        <button
          onClick={() => handleDelete(val)}
          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-colors"
        >
          🗑 Delete
        </button>
      ),
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

      {/* Control bar */}
      <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Lab Diagnostic Documents</h3>
          <p className="text-gray-500 text-xs mt-0.5">Manage, upload and associate diagnostic records to registered patients.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary py-2.5 text-xs font-bold whitespace-nowrap"
        >
          📤 Upload Lab Report
        </button>
      </div>

      {/* Roster list */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={reports} searchable={true} pageSize={10} />
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Patient Lab Report"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient dropdown selection with local filter */}
          <div>
            <label className="input-label">Find Patient *</label>
            <input
              type="text"
              placeholder="🔍 Search patient by name or phone number..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="input-field text-xs py-2 mb-2 font-medium"
            />
            <select
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="input-field text-xs py-2 font-semibold"
              required
            >
              <option value="">-- Choose Patient ({filteredPatients.length} matches) --</option>
              {filteredPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Phone: {p.phone || 'N/A'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Report Title *</label>
            <input
              type="text"
              placeholder="e.g. Complete Blood Count (CBC) / Chest X-Ray"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field text-xs py-2 font-semibold"
              required
            />
          </div>

          <div>
            <label className="input-label">Document Attachment (PDF or Image) *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-primary-500 transition-colors bg-slate-50/50">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-bold text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf, image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>
            {fileToUpload && (
              <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl text-xs">
                <span className="truncate font-semibold">📎 Selected: {fileToUpload.name}</span>
                <span className="font-bold flex-shrink-0">({(fileToUpload.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-250 text-gray-750 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-5 py-2 text-xs font-bold disabled:opacity-50"
            >
              {uploadingFile ? 'Uploading file to R2...' : loading ? 'Saving...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
