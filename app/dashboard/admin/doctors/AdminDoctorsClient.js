'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import ScheduleManagerModal from '@/components/ScheduleManagerModal';

export default function AdminDoctorsClient({ initialDoctors = [], departments = [] }) {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [scheduleDoctor, setScheduleDoctor] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    experience: '',
    phone: '',
    department_id: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photo_r2_key = null;

      // 1. Upload photo if present
      if (photoFile) {
        setUploadingPhoto(true);
        const uploadData = new FormData();
        uploadData.append('file', photoFile);
        uploadData.append('folder', 'doctors');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const uploadResult = await uploadRes.json();

        if (uploadRes.ok) {
          photo_r2_key = uploadResult.key;
        } else {
          throw new Error(uploadResult.error || 'Failed to upload doctor photo');
        }
        setUploadingPhoto(false);
      }

      // 2. Create doctor user
      const docRes = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, photo_r2_key }),
      });

      const docResult = await docRes.json();

      if (docRes.ok) {
        // Find department name for UI sync
        const selectedDept = departments.find(d => d.id === formData.department_id);

        const newDoc = {
          id: docResult.doctorId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          speciality: formData.speciality.trim(),
          experience: formData.experience.trim(),
          phone: formData.phone.trim(),
          department_id: formData.department_id,
          department_name: selectedDept ? selectedDept.name : '',
          photo_r2_key,
        };

        setDoctors(prev => [newDoc, ...prev]);
        setToast({ message: `Doctor ${formData.name} added successfully!`, type: 'success' });
        
        // Reset states
        setFormData({
          name: '',
          email: '',
          password: '',
          speciality: '',
          experience: '',
          phone: '',
          department_id: '',
        });
        setPhotoFile(null);
        setIsModalOpen(false);
      } else {
        setToast({ message: docResult.error || 'Failed to add doctor.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: err.message || 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
      setUploadingPhoto(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete Dr. ${name}? This will also delete their portal user account.`)) {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setDoctors(prev => prev.filter(doc => doc.id !== id));
          setToast({ message: `Dr. ${name} deleted successfully.`, type: 'success' });
        } else {
          const data = await res.json();
          setToast({ message: data.error || 'Failed to delete doctor.', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'Network error. Please try again.', type: 'error' });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const columns = [
    {
      key: 'photo_r2_key',
      label: 'Photo',
      sortable: false,
      render: (val, row) => {
        const url = val 
          ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ''}/${val}`
          : null;
        return (
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-100 flex items-center justify-center font-bold text-primary-600 shadow-sm border border-gray-100">
            {url ? (
              <img src={url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
            )}
          </div>
        );
      },
    },
    {
      key: 'name',
      label: 'Doctor Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-900">Dr. {val}</p>
          <p className="text-gray-500 text-xs mt-0.5">{row.speciality || 'General Practitioner'}</p>
        </div>
      ),
    },
    {
      key: 'department_name',
      label: 'Department',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Contact Info',
      sortable: false,
      render: (val) => <span className="text-sm font-medium">{val || '-'}</span>,
    },
    {
      key: 'experience',
      label: 'Experience',
      sortable: true,
      render: (val) => <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-750 rounded-full">{val || 'N/A'}</span>,
    },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      render: (val, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setScheduleDoctor(row)}
            className="px-3 py-1.5 bg-indigo-50 text-indigo-650 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
          >
            OPD Schedule
          </button>
          <button
            onClick={() => handleDelete(val, row.name)}
            disabled={deletingId !== null}
            className="px-3 py-1.5 bg-red-50 text-red-650 border border-red-200 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
          >
            {deletingId === val ? 'Deleting...' : 'Delete'}
          </button>
        </div>
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

      {/* Roster Controls */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="font-bold text-gray-900 text-base">Clinical Roster</h3>
          <p className="text-gray-500 text-xs mt-0.5">Manage details and credentials for specialists and practitioners.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-2.5 text-xs font-bold"
        >
          Add Doctor
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={doctors} searchable={true} pageSize={10} />
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Doctor & Register Account"
        size="lg"
      >
        <form onSubmit={handleAddDoctor} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="doc-form-name" className="input-label">Full Name *</label>
              <input
                type="text"
                id="doc-form-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="doc-form-email" className="input-label">Email Address (Login Username) *</label>
              <input
                type="email"
                id="doc-form-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="doctor@omchaudharyhospital.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="doc-form-pw" className="input-label">Password *</label>
              <input
                type="password"
                id="doc-form-pw"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="Min 6 characters"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="doc-form-phone" className="input-label">Contact Phone</label>
              <input
                type="tel"
                id="doc-form-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="10-digit number"
              />
            </div>

            {/* Speciality */}
            <div>
              <label htmlFor="doc-form-spec" className="input-label">Speciality / Designation</label>
              <input
                type="text"
                id="doc-form-spec"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="e.g. Consultant Orthopedics"
              />
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="doc-form-exp" className="input-label">Experience (Years / Text)</label>
              <input
                type="text"
                id="doc-form-exp"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="e.g. 10 Years"
              />
            </div>

            {/* Department */}
            <div>
              <label htmlFor="doc-form-dept" className="input-label">Allocate Department *</label>
              <select
                id="doc-form-dept"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="input-field text-xs py-2"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Photo upload */}
            <div>
              <label htmlFor="doc-form-photo" className="input-label">Doctor Photo (JPG/PNG)</label>
              <input
                type="file"
                id="doc-form-photo"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field text-xs py-1.5 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-250 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingPhoto}
              className="btn-primary px-5 py-2 text-xs font-bold disabled:opacity-50"
            >
              {uploadingPhoto ? 'Uploading Photo...' : loading ? 'Saving...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      <ScheduleManagerModal
        isOpen={scheduleDoctor !== null}
        onClose={() => setScheduleDoctor(null)}
        doctor={scheduleDoctor}
      />
    </div>
  );
}
