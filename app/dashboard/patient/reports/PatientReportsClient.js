'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import DocViewerModal from '@/components/DocViewerModal';
import { getR2Url } from '@/lib/r2';

export default function PatientReportsClient({ reports: initialReports = [] }) {
  const [reports, setReports] = useState(initialReports);
  const [doctors, setDoctors] = useState([]);
  const [toast, setToast] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    doctorId: '',
    testType: '',
  });

  // Viewer Modal state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [viewerTitle, setViewerTitle] = useState('');

  useEffect(() => {
    fetch('/api/doctors')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDoctors(data))
      .catch((err) => console.error('Error fetching doctors:', err));
  }, []);

  const handleOpenUpload = () => {
    setFormData({
      title: '',
      doctorId: '',
      testType: '',
    });
    setFileToUpload(null);
    setIsUploadOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileToUpload(file);
      
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
        title: formData.title.trim(),
        r2_file_key: uploadResult.key,
        doctor_id: formData.doctorId || null,
        test_type: formData.testType.trim() || null,
      };

      const res = await fetch('/api/lab-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({
          message: 'Lab report uploaded successfully!',
          type: 'success',
        });

        // Refresh lab reports list
        const refreshRes = await fetch('/api/lab-reports');
        if (refreshRes.ok) {
          const updatedReports = await refreshRes.json();
          setReports(updatedReports);
        }

        setIsUploadOpen(false);
      } else {
        setToast({ message: data.error || 'Failed to save report details.', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: err.message || 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
      setUploadingFile(false);
    }
  };

  const openDocument = (r2Key, title) => {
    const fileUrl = getR2Url(r2Key);
    setViewerUrl(fileUrl);
    setViewerTitle(title);
    setViewerOpen(true);
  };

  const columns = [
    {
      key: 'title',
      label: 'Report / Document Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-gray-900">{val}</span>
          {row.test_type && (
            <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              {row.test_type}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'doctor_name',
      label: 'Prescribing Doctor',
      sortable: true,
      render: (val) => <span className="text-sm text-gray-700 font-medium">{val || 'Self Uploaded / General'}</span>,
    },
    {
      key: 'uploaded_at',
      label: 'Date Uploaded',
      sortable: true,
      render: (val) => (
        <span className="text-sm">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
        </span>
      ),
    },
    {
      key: 'r2_file_key',
      label: 'Document Access',
      sortable: false,
      render: (val, row) => (
        <button
          onClick={() => openDocument(val, row.title)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-750 hover:bg-primary-100 rounded-xl text-xs font-bold transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Open Document
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

      {/* Control panel */}
      <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Upload diagnostic results or blood panels</h3>
          <p className="text-gray-500 text-[11px]">Keep your digital medical record updated for doctors to review.</p>
        </div>
        <button
          onClick={handleOpenUpload}
          className="btn-primary py-2 px-4 text-xs font-bold"
        >
          📤 Upload New Report
        </button>
      </div>

      <DataTable columns={columns} data={reports} searchable={true} pageSize={10} />

      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Lab Report" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Report Title *</label>
            <input
              type="text"
              placeholder="e.g. Complete Blood Count (CBC) / Chest X-Ray"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field text-xs py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Attending Doctor (Optional)</label>
              <select
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="input-field text-xs py-2"
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.speciality || 'Specialist'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Test Type / Tag (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Pathology, Hematology, Radiology"
                value={formData.testType}
                onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                className="input-field text-xs py-2"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Document Attachment (PDF or Image) *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-350 border-dashed rounded-2xl hover:border-primary-500 transition-colors bg-slate-50/50">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-650 justify-center">
                  <label
                    htmlFor="file-upload-patient"
                    className="relative cursor-pointer bg-white rounded-md font-bold text-primary-650 hover:text-primary-550 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload-patient"
                      name="file-upload-patient"
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
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 border border-gray-250 text-gray-750 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-5 py-2 text-xs font-bold disabled:opacity-50"
            >
              {uploadingFile ? 'Uploading file...' : loading ? 'Saving...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Document Viewer Modal */}
      <DocViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        fileUrl={viewerUrl}
        title={viewerTitle}
      />
    </div>
  );
}
