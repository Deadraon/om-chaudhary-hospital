'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function InvoicePrintPage() {
  const params = useParams();
  const id = params?.id;
  const [invoice, setInvoice] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/invoice/${id}`, { credentials: 'include' })
      .then(async r => {
        if (!r.ok) throw new Error((await r.json()).error || 'Not found');
        return r.json();
      })
      .then(data => {
        setInvoice(data);
        try { setItems(JSON.parse(data.items || '[]')); } catch {}
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const HOSPITAL_NAME = 'Om Chaudhary Hospital & Trauma Centre';
  const HOSPITAL_PHONE = '+91-6396098340';
  const HOSPITAL_EMAIL = 'info@omchaudharyhospital.com';
  const HOSPITAL_ADDRESS = 'Najibabad - Haridwar Road, Mandawali, Bijnor, Uttar Pradesh - 246749';

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#0f465c', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: '16px', color: '#64748b', fontSize: '14px' }}>Loading invoice...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error || !invoice) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700 }}>Invoice Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '14px' }}>{error || 'Please verify the URL.'}</p>
        <a href="/dashboard/admin/billing" style={{ display: 'inline-block', marginTop: '20px', padding: '10px 24px', background: '#0f465c', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
          ← Back to Billing
        </a>
      </div>
    </div>
  );

  const subtotal = invoice.subtotal || invoice.total_amount || 0;
  const taxAmount = (subtotal * (invoice.tax || 0)) / 100;
  const discount = invoice.discount || 0;
  const total = invoice.total_amount || 0;

  const statusStyle = {
    paid:    { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
    partial: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  }[invoice.payment_status] || { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };

  const fmt = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : null;
  const issuedDate = fmt(invoice.created_at) || 'N/A';
  const dueDate = fmt(invoice.due_date);
  const showEmail = invoice.patient_email && !invoice.patient_email.includes('@omchaudharyhospital.local');

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; }
        @media print {
          html, body { background: white !important; }
          .no-print { display: none !important; }
          .invoice-page { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; }
          @page { margin: 0.8cm; size: A4 portrait; }
        }
      `}</style>

      {/* Control Bar */}
      <div className="no-print" style={{ background: '#1e293b', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/dashboard/admin/billing" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Billing
        </a>
        <button onClick={() => window.print()} style={{ padding: '8px 20px', background: '#0f465c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Invoice */}
      <div style={{ minHeight: '100vh', padding: '32px 16px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: '#f0f4f8' }}>
        <div className="invoice-page" style={{ width: '100%', maxWidth: '820px', background: 'white', borderRadius: '12px', boxShadow: '0 6px 40px rgba(0,0,0,0.13)', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0f465c 0%, #1a6b85 100%)', padding: '32px 40px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '58px', height: '58px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.25)', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="white" width="32" height="32">
                    <path d="M19 6h-3V3c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9-3h4v3h-4V3zm9 17H5V8h14v12zm-6-9h-2v2H9v2h2v2h2v-2h2v-2h-2v-2z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.5px' }}>OM CHAUDHARY</div>
                  <div style={{ fontSize: '10px', color: '#67e8f9', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '2px' }}>Hospital & Trauma Centre</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>{HOSPITAL_ADDRESS.split(',').slice(0, 3).join(',')}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '9px', color: '#67e8f9', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>TAX INVOICE</div>
                <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '1px' }}>{invoice.invoice_number}</div>
                <div style={{ marginTop: '8px', display: 'inline-block', padding: '4px 14px', background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, borderRadius: '20px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {invoice.payment_status}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>
              <span>📞 {HOSPITAL_PHONE}</span>
              <span>✉️ {HOSPITAL_EMAIL}</span>
              <span style={{ marginLeft: 'auto' }}>Issued: <strong style={{ color: 'white' }}>{issuedDate}</strong></span>
              {dueDate && <span>Due: <strong style={{ color: '#fcd34d' }}>{dueDate}</strong></span>}
            </div>
          </div>

          {/* Patient + Invoice Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e2e8f0' }}>
            <div style={{ background: '#f8fafc', padding: '22px 32px' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Billed To</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{invoice.patient_name}</div>
              {invoice.patient_age && <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Age: {invoice.patient_age} yrs &nbsp;|&nbsp; {invoice.patient_gender || '—'}</div>}
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>📞 {invoice.patient_phone || 'N/A'}</div>
              {showEmail && <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>✉️ {invoice.patient_email}</div>}
              {invoice.patient_address && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: 1.6 }}>{invoice.patient_address}</div>}
            </div>
            <div style={{ background: '#f8fafc', padding: '22px 32px' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Invoice Details</div>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <tbody>
                  {[['Invoice No.', invoice.invoice_number], ['Visit Type', `${invoice.type} Visit`], ['Issued On', issuedDate], ...(dueDate ? [['Payment Due', dueDate]] : []), ['Status', invoice.payment_status?.toUpperCase()]].map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ padding: '3px 0', color: '#64748b', fontWeight: 600 }}>{label}</td>
                      <td style={{ padding: '3px 0', textAlign: 'right', color: '#0f172a', fontWeight: 700 }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0f465c', color: 'white' }}>
                {['#', 'Description', 'Unit Price', 'Qty', 'Amount'].map((h, i) => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: i === 0 ? 'center' : i >= 2 ? 'right' : 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', ...(i === 4 ? { paddingRight: '32px' } : {}) }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</td>
                  <td style={{ padding: '14px 20px', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                    {item.name}
                    {idx === 0 && invoice.type === 'OPD' && <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>Outpatient Department Consultation</div>}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: '13px', color: '#334155' }}>₹{(item.price || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: '13px', color: '#334155' }}>{item.qty || 1}</td>
                  <td style={{ padding: '14px 32px 14px 20px', textAlign: 'right', fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals + Terms */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', borderTop: '2px solid #e5e7eb' }}>
            <div style={{ padding: '24px 32px', borderRight: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Terms & Notes</div>
              <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.75 }}>This is a computer-generated invoice and is valid without a physical signature. Kindly preserve this for TPA/insurance or tax purposes. For billing disputes contact the accounts office within 7 days.</p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '11px', color: '#64748b' }}>
                <span>📞 {HOSPITAL_PHONE}</span>
                <span>✉️ {HOSPITAL_EMAIL}</span>
              </div>
            </div>
            <div style={{ padding: '24px 32px', background: '#f8fafc' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>Summary</div>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ padding: '5px 0', color: '#64748b' }}>Subtotal</td><td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</td></tr>
                  {invoice.tax > 0 && <tr><td style={{ padding: '5px 0', color: '#64748b' }}>Tax ({invoice.tax}%)</td><td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600 }}>₹{taxAmount.toLocaleString('en-IN')}</td></tr>}
                  {discount > 0 && <tr><td style={{ padding: '5px 0', color: '#64748b' }}>Discount</td><td style={{ padding: '5px 0', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>− ₹{discount.toLocaleString('en-IN')}</td></tr>}
                  <tr><td colSpan={2}><div style={{ height: '1px', background: '#cbd5e1', margin: '10px 0' }} /></td></tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>Total</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 900, fontSize: '18px', color: '#0f465c' }}>₹{total.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr><td colSpan={2} style={{ paddingTop: '4px', fontSize: '9px', color: '#94a3b8', textAlign: 'right' }}>INR (Indian Rupees)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature */}
          <div style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              <div style={{ fontWeight: 700, color: '#475569', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '9px' }}>Hospital Address</div>
              {HOSPITAL_ADDRESS}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ width: '140px', borderBottom: '1.5px solid #334155', height: '36px', marginBottom: '4px' }} />
              <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Authorized Signatory</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{HOSPITAL_NAME}</div>
            </div>
          </div>

          {/* Accent */}
          <div style={{ height: '6px', background: 'linear-gradient(90deg, #0f465c, #1a6b85, #22d3ee, #1a6b85, #0f465c)' }} />
        </div>
      </div>
    </>
  );
}
