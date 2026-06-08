'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export default function AdminStaffClient({ initialStaff = [], currentUserId }) {
  const [staffList, setStaffList] = useState(initialStaff);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receptionist',
    phone: '',
    customRole: '',
  });

  // The actual role sent to API: if role === 'custom', use customRole text
  const effectiveRole = formData.role === 'custom' ? formData.customRole.trim() : formData.role;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: effectiveRole }),
      });

      const data = await res.json();

      if (res.ok) {
        const newStaff = {
          id: data.staffId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          phone: formData.phone.trim(),
          user_role: formData.role,
        };

        setStaffList(prev => [newStaff, ...prev]);
        setToast({ message: `Staff member ${formData.name} added successfully!`, type: 'success' });
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'receptionist',
          phone: '',
          customRole: '',
        });
        setIsModalOpen(false);
      } else {
        setToast({ message: data.error || 'Failed to add staff member.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name, userId) => {
    if (userId === currentUserId) {
      setToast({ message: 'You cannot delete your own admin account!', type: 'error' });
      return;
    }

    if (confirm(`Are you sure you want to delete ${name}? This will revoke their portal access.`)) {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setStaffList(prev => prev.filter(s => s.id !== id));
          setToast({ message: `Staff member ${name} deleted successfully.`, type: 'success' });
        } else {
          const data = await res.json();
          setToast({ message: data.error || 'Failed to delete staff member.', type: 'error' });
        }
      } catch (err) {
        setToast({ message: 'Network error. Please try again.', type: 'error' });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const ROLE_LABELS = {
    super_admin:    'Administrator',
    receptionist:   'Receptionist',
    doctor:         'Doctor',
    nurse:          'Nurse',
    lab_technician: 'Lab Technician',
    pharmacist:     'Pharmacist',
    ward_boy:       'Ward Boy',
    accountant:     'Accountant',
    other:          'Other Staff',
  };

  const getRoleLabel = (role) => ROLE_LABELS[role] || role || '—';

  const roleColors = {
    super_admin:    'bg-indigo-50 text-indigo-750 border-indigo-200',
    receptionist:   'bg-teal-50 text-teal-750 border-teal-200',
    doctor:         'bg-primary-50 text-primary-750 border-primary-200',
    nurse:          'bg-pink-50 text-pink-700 border-pink-200',
    lab_technician: 'bg-amber-50 text-amber-700 border-amber-200',
    pharmacist:     'bg-emerald-50 text-emerald-700 border-emerald-200',
    ward_boy:       'bg-orange-50 text-orange-700 border-orange-200',
    accountant:     'bg-purple-50 text-purple-700 border-purple-200',
    other:          'bg-gray-50 text-gray-700 border-gray-200',
  };

  const getRoleColor = (role) => roleColors[role] || 'bg-sky-50 text-sky-700 border-sky-200';

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-900">{val}</p>
          {row.user_id === currentUserId && (
            <span className="inline-flex text-[9px] font-bold text-primary-650 bg-primary-50 px-1.5 py-0.5 rounded-md mt-0.5 border border-primary-200">Logged In</span>
          )}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email / Username',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
      render: (val) => <span className="text-sm font-medium">{val || '-'}</span>,
    },
    {
      key: 'role',
      label: 'Access Role',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getRoleColor(val)}`}>
          {getRoleLabel(val)}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      render: (val, row) => (
        <button
          onClick={() => handleDelete(val, row.name, row.user_id)}
          disabled={deletingId !== null || row.user_id === currentUserId}
          className="px-3 py-1.5 bg-red-50 text-red-650 border border-red-200 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {deletingId === val ? 'Deleting...' : 'Delete'}
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

      {/* Roster Controls */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="font-bold text-gray-900 text-base">Portal Staff</h3>
          <p className="text-gray-500 text-xs mt-0.5">Manage credentials and permissions for administrative and receptionist teams.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-2.5 text-xs font-bold"
        >
          Add Staff
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={staffList} searchable={true} pageSize={10} />
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Staff Member"
        size="md"
      >
        <form onSubmit={handleAddStaff} className="space-y-5">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="staff-form-name" className="input-label">Full Name *</label>
              <input
                type="text"
                id="staff-form-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="e.g. Archit Chaudhary"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="staff-form-email" className="input-label">Email Address (Login Username) *</label>
              <input
                type="email"
                id="staff-form-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="reception@omchaudharyhospital.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="staff-form-pw" className="input-label">Password *</label>
              <input
                type="password"
                id="staff-form-pw"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="staff-form-phone" className="input-label">Contact Phone</label>
              <input
                type="tel"
                id="staff-form-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field text-xs py-2"
                placeholder="10-digit number"
              />
            </div>

            {/* Role select */}
            <div>
              <label htmlFor="staff-form-role" className="input-label">System Role *</label>
              <select
                id="staff-form-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field text-xs py-2"
                required
              >
                <optgroup label="Clinical">
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="lab_technician">Lab Technician</option>
                  <option value="pharmacist">Pharmacist</option>
                </optgroup>
                <optgroup label="Administrative">
                  <option value="receptionist">Receptionist</option>
                  <option value="accountant">Accountant</option>
                  <option value="super_admin">Administrator (Full Access)</option>
                </optgroup>
                <optgroup label="Support">
                  <option value="ward_boy">Ward Boy / Attendant</option>
                  <option value="other">Other Staff</option>
                  <option value="custom">✏️ Custom Role (Type Below)</option>
                </optgroup>
              </select>

              {/* Custom role text input — shows only when 'custom' is selected */}
              {formData.role === 'custom' && (
                <div className="mt-2">
                  <input
                    type="text"
                    name="customRole"
                    value={formData.customRole}
                    onChange={handleChange}
                    className="input-field text-xs py-2"
                    placeholder="Enter custom role name (e.g. Physiotherapist)"
                    required
                    autoFocus
                  />
                  <p className="text-[10px] text-gray-400 mt-1">This will be saved exactly as typed</p>
                </div>
              )}
            </div>
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
              {loading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
