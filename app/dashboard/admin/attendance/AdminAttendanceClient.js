'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export default function AdminAttendanceClient({ initialLogs = [], staffList = [] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [formData, setFormData] = useState({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '',
    checkOut: '',
    status: 'present',
    notes: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    try {
      const [h1, m1, s1 = 0] = checkIn.split(':').map(Number);
      const [h2, m2, s2 = 0] = checkOut.split(':').map(Number);
      const diffMs = (h2 * 3600 + m2 * 60 + s2) - (h1 * 3600 + m1 * 60 + s1);
      if (diffMs <= 0) return '0.0 hr';
      const hours = diffMs / 3600;
      return `${hours.toFixed(1)} hrs`;
    } catch (e) {
      return '-';
    }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({
      userId: staffList[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00',
      checkOut: '17:00',
      status: 'present',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (row) => {
    setIsEditMode(true);
    setFormData({
      userId: row.user_id,
      date: row.date,
      checkIn: row.check_in ? row.check_in.slice(0, 5) : '',
      checkOut: row.check_out ? row.check_out.slice(0, 5) : '',
      status: row.status,
      notes: row.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        action: 'admin-update',
        ...formData,
      };

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({
          message: isEditMode ? 'Attendance record adjusted successfully!' : 'Attendance record logged successfully!',
          type: 'success',
        });
        
        // Refresh full roster logs
        const refreshRes = await fetch('/api/attendance');
        if (refreshRes.ok) {
          const updatedLogs = await refreshRes.json();
          setLogs(updatedLogs);
        }

        setIsModalOpen(false);
      } else {
        setToast({ message: data.error || 'Failed to update attendance.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const roleColors = {
    super_admin: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    doctor: 'bg-primary-50 text-primary-700 border-primary-100',
    receptionist: 'bg-teal-50 text-teal-700 border-teal-100',
  };

  const statusColors = {
    present: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    absent: 'bg-red-50 text-red-700 border-red-100',
    half_day: 'bg-amber-50 text-amber-700 border-amber-100',
    on_leave: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const filteredLogs = logs.filter(log => {
    const matchesDate = filterDate ? log.date === filterDate : true;
    const matchesRole = filterRole ? log.user_role === filterRole : true;
    return matchesDate && matchesRole;
  });

  // Calculate statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter(l => l.date === todayStr);
  const presentCount = todayLogs.filter(l => l.status === 'present' || l.status === 'half_day').length;
  const leaveCount = todayLogs.filter(l => l.status === 'on_leave').length;

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) => <span className="font-bold text-gray-900">{val}</span>,
    },
    {
      key: 'user_name',
      label: 'Employee Name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-900 leading-none">{val}</p>
          <span className="text-[10px] text-gray-400 mt-1 block">{row.user_email}</span>
        </div>
      ),
    },
    {
      key: 'user_role',
      label: 'Role',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${roleColors[val] || 'bg-gray-50 text-gray-650'}`}>
          {val === 'super_admin' ? 'Admin' : val === 'receptionist' ? 'Receptionist' : 'Doctor'}
        </span>
      ),
    },
    {
      key: 'check_in',
      label: 'Check In',
      render: (val) => <span className="text-gray-900 font-semibold text-xs">{val || '--:--'}</span>,
    },
    {
      key: 'check_out',
      label: 'Check Out',
      render: (val) => <span className="text-gray-900 font-semibold text-xs">{val || '--:--'}</span>,
    },
    {
      key: 'duration',
      label: 'Working Hours',
      render: (_, row) => (
        <span className="text-gray-500 font-medium text-xs">
          {calculateHours(row.check_in, row.check_out)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${statusColors[val] || 'bg-gray-50 text-gray-550'}`}>
          {val.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'notes',
      label: 'Notes / Remarks',
      render: (val) => <span className="text-xs text-gray-500 max-w-[150px] block truncate">{val || '-'}</span>,
    },
    {
      key: 'id',
      label: 'Correction',
      render: (_, row) => (
        <button
          onClick={() => handleOpenEdit(row)}
          className="px-2.5 py-1 text-[10px] bg-slate-50 border border-slate-200 hover:border-sarvodaya-blue text-slate-700 hover:text-sarvodaya-blue font-bold rounded-lg transition-colors"
        >
          ✏ Edit
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

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Today's Attendance</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{presentCount} Present</h3>
          </div>
          <span className="text-2xl p-2 bg-emerald-50 text-emerald-500 rounded-2xl">✓</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Today's Leaves</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{leaveCount} On Leave</h3>
          </div>
          <span className="text-2xl p-2 bg-slate-50 text-slate-400 rounded-2xl">🌴</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total logged records</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{logs.length} Log entries</h3>
          </div>
          <span className="text-2xl p-2 bg-indigo-50 text-indigo-500 rounded-2xl">📁</span>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Date:</span>
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-gray-250 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-sarvodaya-blue font-semibold text-gray-800"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Role:</span>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-gray-250 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-sarvodaya-blue font-semibold text-gray-800"
            >
              <option value="">All Roles</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
              <option value="super_admin">Admin</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(filterDate || filterRole) && (
            <button
              onClick={() => { setFilterDate(''); setFilterRole(''); }}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-primary py-2.5 text-xs font-bold whitespace-nowrap"
        >
          ✍ Manual Log entry
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={filteredLogs} searchable={true} pageSize={10} />
      </div>

      {/* Manual Entry/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Adjust Roster Record' : 'Manual Roster Log'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Select Employee *</label>
            <select
              disabled={isEditMode}
              value={formData.userId}
              onChange={e => setFormData({ ...formData, userId: e.target.value })}
              className="input-field text-xs py-2 disabled:bg-slate-100 disabled:text-slate-500 font-semibold"
              required
            >
              {staffList.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role === 'super_admin' ? 'Admin' : emp.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Date *</label>
              <input
                type="date"
                disabled={isEditMode}
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="input-field text-xs py-2 disabled:bg-slate-100 disabled:text-slate-500 font-semibold"
                required
              />
            </div>

            <div>
              <label className="input-label">Shift Status *</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="input-field text-xs py-2 font-semibold"
                required
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half_day">Half Day</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Check In Time (HH:MM)</label>
              <input
                type="time"
                value={formData.checkIn}
                onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                className="input-field text-xs py-2 font-semibold"
              />
            </div>

            <div>
              <label className="input-label">Check Out Time (HH:MM)</label>
              <input
                type="time"
                value={formData.checkOut}
                onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                className="input-field text-xs py-2 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Remarks / Adjustment Reason</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="input-field text-xs py-2"
              placeholder="e.g. Forgot to check out, Medical leave approved, etc."
            ></textarea>
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
              {loading ? 'Saving...' : 'Save Adjustment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
