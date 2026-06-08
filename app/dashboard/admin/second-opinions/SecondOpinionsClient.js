'use client';

import { useState, useMemo } from 'react';
import DataTable from '@/components/DataTable';
import Toast from '@/components/Toast';
import { getR2Url } from '@/lib/r2';

export default function SecondOpinionsClient({ initialSubmissions = [] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/second-opinions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmissions(prev =>
          prev.map(sub => (sub.id === id ? { ...sub, status: newStatus } : sub))
        );
        setToast({
          message: `Request status successfully updated to "${newStatus}".`,
          type: 'success',
        });
      } else {
        setToast({ message: data.error || 'Failed to update request.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredSubmissions = useMemo(() => {
    if (!statusFilter) return submissions;
    return submissions.filter(sub => sub.status === statusFilter);
  }, [submissions, statusFilter]);

  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
    replied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const columns = [
    {
      key: 'patient_name',
      label: 'Patient Details',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-semibold text-gray-900">{val}</p>
          <p className="text-gray-500 text-xs mt-0.5">{row.phone}</p>
        </div>
      ),
    },
    {
      key: 'specialty',
      label: 'Specialty Requested',
      sortable: true,
      render: (val) => <span className="text-xs font-bold text-slate-800">{val}</span>,
    },
    {
      key: 'file_name',
      label: 'Uploaded File / Report',
      sortable: false,
      render: (val) => {
        if (!val) return <span className="text-gray-400 text-xs">No file</span>;
        const downloadUrl = getR2Url(val);
        // Get clean filename
        const cleanName = val.split('/').pop() || 'Download Report';
        return (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-bold text-xs"
            title="Download Report"
          >
            📎 {cleanName.substring(cleanName.indexOf('-') + 1)}
          </a>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Submission Date',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-medium text-gray-600">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val, row) => (
        <select
          value={val}
          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
          disabled={updatingId === row.id}
          className={`px-2 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none ${statusColors[val] || 'bg-gray-50 text-gray-755'}`}
        >
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="replied">Replied</option>
        </select>
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

      {/* Filter Options */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <label htmlFor="second-opinion-status-filter" className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Filter Status</label>
          <select
            id="second-opinion-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field py-2 text-xs w-48"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-xs font-medium">Total Submissions</p>
          <p className="text-2xl font-bold text-gray-900">{filteredSubmissions.length}</p>
        </div>
      </div>

      {/* Inbox Data Table */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
        <DataTable columns={columns} data={filteredSubmissions} searchable={true} pageSize={10} />
      </div>
    </div>
  );
}
