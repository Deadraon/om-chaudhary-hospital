'use client';

import { useState } from 'react';
import DataTable from '@/components/DataTable';
import Modal from '@/components/Modal';

export default function PatientBillingClient({ invoices: initialInvoices = [] }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const statusPills = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-150',
    pending: 'bg-amber-50 text-amber-700 border-amber-150',
    partial: 'bg-sky-50 text-sky-700 border-sky-150',
  };

  const handleOpenDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setIsOpen(true);
  };

  const getParsedItems = (itemsJson) => {
    try {
      return JSON.parse(itemsJson || '[]');
    } catch (e) {
      return [];
    }
  };

  const columns = [
    {
      key: 'invoice_number',
      label: 'Invoice No.',
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-gray-900">{val}</span>,
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
      label: 'Amount Due',
      sortable: true,
      render: (val) => <span className="font-bold text-gray-900 text-sm">₹{val.toLocaleString()}</span>,
    },
    {
      key: 'payment_status',
      label: 'Payment Status',
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
        <span className="text-sm">
          {val ? new Date(val).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '-'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Details',
      sortable: false,
      render: (val, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenDetail(row)}
            className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-750 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            🔍 View Items
          </button>
          <a
            href={`/dashboard/admin/billing/print/${val}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            📥 Download PDF
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {initialInvoices.length === 0 ? (
        <p className="text-gray-400 text-xs italic py-4">You do not have any transaction or invoice histories registered in our portal.</p>
      ) : (
        <DataTable columns={columns} data={initialInvoices} searchable={true} pageSize={10} />
      )}

      {/* Invoice items detail modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Invoice Details" size="md">
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
              <div>
                <p className="text-gray-400 font-semibold uppercase tracking-wider">Invoice No.</p>
                <p className="font-mono font-bold text-gray-900 mt-0.5">{selectedInvoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-semibold uppercase tracking-wider">Issued Date</p>
                <p className="font-bold text-gray-900 mt-0.5">
                  {new Date(selectedInvoice.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Itemized Breakdown</h4>
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 text-gray-400 font-bold">
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getParsedItems(selectedInvoice.items).map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/30 font-medium">
                        <td className="p-3 text-gray-900">{item.name}</td>
                        <td className="p-3 text-gray-650 text-right">₹{item.price.toLocaleString()}</td>
                        <td className="p-3 text-gray-650 text-right">{item.qty || 1}</td>
                        <td className="p-3 text-gray-900 text-right font-bold">₹{(item.price * (item.qty || 1)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations summaries */}
            <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs flex flex-col items-end">
              <div className="flex justify-between w-full max-w-[220px]">
                <span className="text-gray-400 font-semibold">Subtotal:</span>
                <span className="font-bold text-gray-800">₹{(selectedInvoice.subtotal || selectedInvoice.total_amount).toLocaleString()}</span>
              </div>
              {selectedInvoice.tax > 0 && (
                <div className="flex justify-between w-full max-w-[220px]">
                  <span className="text-gray-400 font-semibold">Tax ({selectedInvoice.tax}%):</span>
                  <span className="font-bold text-gray-800">
                    ₹{(((selectedInvoice.subtotal || selectedInvoice.total_amount) * selectedInvoice.tax) / 100).toLocaleString()}
                  </span>
                </div>
              )}
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between w-full max-w-[220px]">
                  <span className="text-gray-400 font-semibold">Discount:</span>
                  <span className="font-bold text-red-600">- ₹{selectedInvoice.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between w-full max-w-[220px]">
                <span className="font-black text-gray-900">Grand Total:</span>
                <span className="font-black text-primary-750">₹{selectedInvoice.total_amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-250 text-gray-750 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <a
                href={`/dashboard/admin/billing/print/${selectedInvoice.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-5 py-2 text-xs font-bold text-center inline-flex items-center gap-1.5"
              >
                🖨️ Download / Print
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
