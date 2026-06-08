'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export default function AdminBillingClient({ initialInvoices = [], patients = [], appointments = [] }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [toast, setToast] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Always fetch fresh invoices from API on mount
  useEffect(() => {
    setLoadingInvoices(true);
    fetch('/api/admin/billing', { credentials: 'include' })
      .then(async r => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}));
          console.error('Billing API error:', r.status, err);
          return [];
        }
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) setInvoices(data);
        else console.error('Billing API returned non-array:', data);
      })
      .catch(err => console.error('Failed to load invoices:', err))
      .finally(() => setLoadingInvoices(false));
  }, []);

  // Search/Filter for Patients inside Modal
  const [patientSearch, setPatientSearch] = useState('');
  const [patientList, setPatientList] = useState(patients);

  // Quick-add patient state
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [addPatientLoading, setAddPatientLoading] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', phone: '', address: '', age: '', gender: 'Male' });

  // Invoice form state
  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    appointmentId: '',
    type: 'OPD',
    items: [{ name: 'OPD Consultation Fee', price: 300, qty: 1 }],
    tax: 0,
    discount: 0,
    paymentStatus: 'pending',
    dueDate: '',
  });

  const handleOpenCreate = () => {
    setInvoiceForm({
      patientId: '',
      appointmentId: '',
      type: 'OPD',
      items: [{ name: 'OPD Consultation Fee', price: 300, qty: 1 }],
      tax: 0,
      discount: 0,
      paymentStatus: 'pending',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    });
    setPatientSearch('');
    setIsCreateOpen(true);
  };

  const handleAddItem = () => {
    setInvoiceForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', price: 0, qty: 1 }],
    }));
  };

  const handleRemoveItem = (index) => {
    if (invoiceForm.items.length === 1) return;
    setInvoiceForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceForm.items];
    if (field === 'price') {
      updatedItems[index].price = parseFloat(value) || 0;
    } else if (field === 'qty') {
      updatedItems[index].qty = parseInt(value) || 1;
    } else {
      updatedItems[index].name = value;
    }
    setInvoiceForm((prev) => ({ ...prev, items: updatedItems }));
  };

  const calculateSubtotal = () => {
    return invoiceForm.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    const taxAmt = (sub * (invoiceForm.tax || 0)) / 100;
    return sub + taxAmt - (invoiceForm.discount || 0);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceForm.patientId) {
      setToast({ message: 'Please select a patient.', type: 'error' });
      return;
    }

    setLoading(true);
    const sub = calculateSubtotal();
    const total = calculateTotal();

    const payload = {
      patient_id: invoiceForm.patientId,
      appointment_id: invoiceForm.appointmentId || null,
      type: invoiceForm.type,
      items: invoiceForm.items,
      subtotal: sub,
      tax: invoiceForm.tax,
      discount: invoiceForm.discount,
      total_amount: total,
      payment_status: invoiceForm.paymentStatus,
      due_date: invoiceForm.dueDate,
    };

    try {
      const res = await fetch('/api/admin/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Invoice generated successfully! (${data.invoiceNumber})`, type: 'success' });
        
        // Refresh invoices list
        const refreshRes = await fetch('/api/admin/billing');
        if (refreshRes.ok) {
          const updated = await refreshRes.json();
          setInvoices(updated);
        }
        setIsCreateOpen(false);
      } else {
        setToast({ message: data.error || 'Failed to create invoice.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatus = (invoice) => {
    setSelectedInvoice(invoice);
    setNewStatus(invoice.payment_status);
    setIsStatusOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/billing/${selectedInvoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: newStatus }),
      });

      if (res.ok) {
        setToast({ message: 'Payment status updated successfully!', type: 'success' });
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === selectedInvoice.id ? { ...inv, payment_status: newStatus } : inv))
        );
        setIsStatusOpen(false);
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to update status.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this invoice?')) return;

    try {
      const res = await fetch(`/api/admin/billing/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
        setToast({ message: 'Invoice deleted successfully.', type: 'success' });
      } else {
        const data = await res.json();
        setToast({ message: data.error || 'Failed to delete invoice.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Network error.', type: 'error' });
    }
  };

  const filteredPatients = patientList.filter(
    (p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      (p.phone && p.phone.includes(patientSearch))
  );

  const handleAddNewPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.phone) {
      setToast({ message: 'Name and phone are required.', type: 'error' });
      return;
    }
    setAddPatientLoading(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        const created = { id: data.id, name: newPatient.name, phone: newPatient.phone, address: newPatient.address };
        setPatientList((prev) => [...prev, created]);
        setInvoiceForm((prev) => ({ ...prev, patientId: data.id }));
        setPatientSearch(newPatient.name);
        setNewPatient({ name: '', phone: '', address: '', age: '', gender: 'Male' });
        setShowAddPatient(false);
        setToast({ message: `Patient "${created.name}" added and selected!`, type: 'success' });
      } else {
        setToast({ message: data.error || 'Failed to add patient.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error adding patient.', type: 'error' });
    } finally {
      setAddPatientLoading(false);
    }
  };

  const statusPills = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-150',
    pending: 'bg-amber-50 text-amber-700 border-amber-150',
    partial: 'bg-sky-50 text-sky-700 border-sky-150',
  };

  const columns = [
    {
      key: 'invoice_number',
      label: 'Invoice No.',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-gray-900">{val}</span>,
    },
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
      key: 'type',
      label: 'Visit Type',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-bold ${val === 'IPD' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'total_amount',
      label: 'Total Amount',
      sortable: true,
      render: (val) => <span className="font-bold text-gray-900 text-sm">₹{val.toLocaleString()}</span>,
    },
    {
      key: 'payment_status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${statusPills[val] || 'bg-gray-100 text-gray-600'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Issued Date',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-gray-500">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      render: (val, row) => (
        <div className="flex gap-1.5 flex-wrap">
          {/* Preview — opens the clean invoice page in new tab (same as print) */}
          <a
            href={`/invoice/${val}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1"
          >
            👁️ Preview
          </a>
          <a
            href={`/invoice/${val}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1"
          >
            🖨️ Print
          </a>
          <button
            onClick={() => handleOpenStatus(row)}
            className="px-2.5 py-1.5 bg-primary-50 text-primary-750 hover:bg-primary-100 border border-primary-100 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            💳 Status
          </button>
          <button
            onClick={() => handleDeleteInvoice(val)}
            className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold transition-all"
          >
            🗑️ Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Widget */}
      <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Hospital Invoicing Registry</h3>
          <p className="text-gray-500 text-xs mt-0.5">Generate receipts, record invoice itemization and audit transaction statuses.</p>
        </div>

        <button onClick={handleOpenCreate} className="btn-primary py-2.5 text-xs font-bold whitespace-nowrap">
          ➕ Generate New Invoice
        </button>
      </div>

      {/* DataTable listing */}
      <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto">
        {loadingInvoices ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-400 font-medium">Loading invoices...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={invoices} searchable={true} pageSize={10} />
        )}
      </div>

      {/* Invoice Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Invoice Preview" size="lg">
        {previewInvoice && (() => {
          let items = [];
          try { items = JSON.parse(previewInvoice.items || '[]'); } catch {}
          const statusColors = {
            paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            partial: 'bg-sky-50 text-sky-700 border-sky-200',
          };
          return (
            <div className="space-y-5">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Om Chaudhary Hospital & Trauma Centre</p>
                  <p className="font-mono font-black text-gray-900 text-lg mt-1">{previewInvoice.invoice_number}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(previewInvoice.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[previewInvoice.payment_status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {previewInvoice.payment_status}
                </span>
              </div>

              {/* Patient + Visit Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Billed To</p>
                  <p className="font-bold text-gray-900">{previewInvoice.patient_name}</p>
                  <p className="text-gray-500 mt-0.5">📞 {previewInvoice.patient_phone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px] mb-1">Visit Details</p>
                  <p className="font-bold text-gray-900">{previewInvoice.type} Visit</p>
                  {previewInvoice.due_date && <p className="text-gray-500 mt-0.5">Due: {new Date(previewInvoice.due_date).toLocaleDateString('en-IN')}</p>}
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-gray-400 font-bold uppercase text-[10px]">#</th>
                      <th className="text-left px-4 py-2.5 text-gray-400 font-bold uppercase text-[10px]">Description</th>
                      <th className="text-right px-4 py-2.5 text-gray-400 font-bold uppercase text-[10px]">Price</th>
                      <th className="text-right px-4 py-2.5 text-gray-400 font-bold uppercase text-[10px]">Qty</th>
                      <th className="text-right px-4 py-2.5 text-gray-400 font-bold uppercase text-[10px]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-2.5 font-semibold text-gray-800">{item.name}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">₹{(item.price || 0).toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-gray-600">{item.qty || 1}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-gray-900">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-56 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-semibold">Subtotal:</span>
                    <span className="font-bold text-gray-800">₹{(previewInvoice.subtotal || previewInvoice.total_amount || 0).toLocaleString()}</span>
                  </div>
                  {previewInvoice.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold">Tax ({previewInvoice.tax}%):</span>
                      <span className="font-bold text-gray-800">₹{(((previewInvoice.subtotal || 0) * previewInvoice.tax) / 100).toLocaleString()}</span>
                    </div>
                  )}
                  {previewInvoice.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-semibold">Discount:</span>
                      <span className="font-bold text-red-600">- ₹{previewInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-1">
                    <span className="font-black text-gray-900 text-sm">Grand Total:</span>
                    <span className="font-black text-primary-750 text-sm">₹{(previewInvoice.total_amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50"
                >
                  Close
                </button>
                <a
                  href={`/dashboard/admin/billing/print/${previewInvoice.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  🖨️ Open Print Page
                </a>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Status override Modal */}
      <Modal isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} title="Update Payment Status" size="sm">
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          {selectedInvoice && (
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">
                Updating invoice <span className="font-mono text-gray-900 font-bold">{selectedInvoice.invoice_number}</span> for patient <span className="text-gray-900 font-bold">{selectedInvoice.patient_name}</span>.
              </p>
              <p className="text-sm font-bold text-gray-900 mb-4">Total Due: ₹{selectedInvoice.total_amount.toLocaleString()}</p>
            </div>
          )}

          <div>
            <label className="input-label">Payment Status *</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="input-field text-xs py-2 font-semibold"
            >
              <option value="pending">Pending (Unpaid)</option>
              <option value="partial">Partial Payment</option>
              <option value="paid">Paid (Cleared)</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsStatusOpen(false)}
              className="px-4 py-2 border border-gray-250 text-gray-750 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-5 py-2 text-xs font-bold">
              {loading ? 'Saving...' : 'Update Status'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Invoice creation Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Generate Patient Invoice" size="lg">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient finder */}
            <div>
              <label className="input-label">Find Patient *</label>
              <input
                type="text"
                placeholder="🔍 Search name or phone..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="input-field text-xs py-2 mb-2 font-medium"
              />
              <select
                value={invoiceForm.patientId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, patientId: e.target.value })}
                className="input-field text-xs py-2 font-semibold"
                required
              >
                <option value="">-- Choose Patient --</option>
                {filteredPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Phone: {p.phone || 'N/A'})
                  </option>
                ))}
              </select>

              {/* No results hint + Quick Add */}
              {patientSearch && filteredPatients.length === 0 && !showAddPatient && (
                <div className="mt-2 flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-xs text-amber-700 font-semibold flex-1">No patient found for &quot;{patientSearch}&quot;</span>
                  <button
                    type="button"
                    onClick={() => { setShowAddPatient(true); setNewPatient((p) => ({ ...p, name: patientSearch })); }}
                    className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all whitespace-nowrap"
                  >
                    ➕ Add Patient
                  </button>
                </div>
              )}

              {/* Inline quick-add form */}
              {showAddPatient && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-emerald-800">➕ Quick Add New Patient</span>
                    <button type="button" onClick={() => setShowAddPatient(false)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      className="input-field text-xs py-1.5 col-span-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      className="input-field text-xs py-1.5"
                      maxLength={10}
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      className="input-field text-xs py-1.5"
                      min="0"
                    />
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="input-field text-xs py-1.5"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Address (optional)"
                      value={newPatient.address}
                      onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                      className="input-field text-xs py-1.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewPatient}
                    disabled={addPatientLoading}
                    className="w-full py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all mt-1 disabled:opacity-60"
                  >
                    {addPatientLoading ? 'Saving...' : '✅ Save & Select Patient'}
                  </button>
                </div>
              )}
            </div>

            {/* Visit type and due date */}
            <div className="space-y-4">
              <div>
                <label className="input-label">Visit Type *</label>
                <div className="flex gap-4 pt-1">
                  <label className="inline-flex items-center text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={invoiceForm.type === 'OPD'}
                      onChange={() => setInvoiceForm({ ...invoiceForm, type: 'OPD' })}
                      className="mr-1.5 focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    OPD Consultation
                  </label>
                  <label className="inline-flex items-center text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      checked={invoiceForm.type === 'IPD'}
                      onChange={() => setInvoiceForm({ ...invoiceForm, type: 'IPD' })}
                      className="mr-1.5 focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    IPD Hospitalization
                  </label>
                </div>
              </div>

              <div>
                <label className="input-label">Payment Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="input-field text-xs py-2 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Optional appointment linker */}
          <div>
            <label className="input-label">Link Appointment Record (Optional)</label>
            <select
              value={invoiceForm.appointmentId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, appointmentId: e.target.value })}
              className="input-field text-xs py-2 font-medium"
            >
              <option value="">-- No linked appointment --</option>
              {appointments
                .filter((a) => !invoiceForm.patientId || a.phone === patients.find((p) => p.id === invoiceForm.patientId)?.phone)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    Date: {a.preferred_date} | Doctor: {a.doctor_name || 'N/A'} (Patient: {a.patient_name})
                  </option>
                ))}
            </select>
          </div>

          {/* Itemized Builder */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Itemized Line Items</h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-extrabold transition-all border border-sky-150"
              >
                ➕ Add Item Row
              </button>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {invoiceForm.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Description (e.g. Consultation fee, Blood test, Paracetamol)"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    className="input-field text-xs py-2 flex-1"
                    required
                  />
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={item.price || ''}
                      onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                      className="input-field text-xs py-2"
                      min="0"
                      required
                    />
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.qty || ''}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      className="input-field text-xs py-2"
                      min="1"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={invoiceForm.items.length === 1}
                    className="p-2 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-all border border-red-150"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl">
            <div className="space-y-3">
              <div>
                <label className="input-label">Tax Rate (%)</label>
                <input
                  type="number"
                  value={invoiceForm.tax || ''}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, tax: parseFloat(e.target.value) || 0 })}
                  className="input-field text-xs py-2 font-medium"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="input-label">Discount Amount (₹)</label>
                <input
                  type="number"
                  value={invoiceForm.discount || ''}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: parseFloat(e.target.value) || 0 })}
                  className="input-field text-xs py-2 font-medium"
                  min="0"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end items-end space-y-1.5 text-xs text-gray-655 pr-2">
              <div className="flex justify-between w-full max-w-[200px]">
                <span className="font-semibold text-gray-500">Subtotal:</span>
                <span className="font-bold text-gray-800">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[200px]">
                <span className="font-semibold text-gray-500">Tax ({invoiceForm.tax || 0}%):</span>
                <span className="font-bold text-gray-800">₹{((calculateSubtotal() * (invoiceForm.tax || 0)) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[200px]">
                <span className="font-semibold text-gray-500">Discount:</span>
                <span className="font-bold text-red-600">- ₹{(invoiceForm.discount || 0).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 mt-1 flex justify-between w-full max-w-[200px]">
                <span className="font-black text-gray-900 text-sm">Grand Total:</span>
                <span className="font-black text-primary-750 text-sm">₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Initial payment status */}
          <div>
            <label className="input-label">Initial Payment Status *</label>
            <select
              value={invoiceForm.paymentStatus}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentStatus: e.target.value })}
              className="input-field text-xs py-2 font-bold"
            >
              <option value="pending">Pending (Unpaid)</option>
              <option value="partial">Partial Payment</option>
              <option value="paid">Paid (Fully Cleared)</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 border border-gray-250 text-gray-750 text-xs font-semibold rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary px-5 py-2 text-xs font-bold">
              {loading ? 'Creating...' : 'Generate Invoice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
