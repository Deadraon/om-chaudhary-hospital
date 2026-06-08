import { queryD1First } from '@/lib/d1';
import PrintControls from '../PrintControls';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Invoice | Om Chaudhary Hospital & Trauma Centre',
};

export default async function PrintInvoicePage({ params }) {
  const { id } = params;
  let invoice = null;

  try {
    invoice = await queryD1First(`
      SELECT inv.*, 
        COALESCE(p.name, 'Unknown Patient') AS patient_name, 
        p.phone AS patient_phone, 
        p.address AS patient_address,
        p.blood_group AS patient_blood_group,
        u.email AS patient_email
      FROM invoices inv
      LEFT JOIN patients p ON inv.patient_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE inv.id = ?
    `, [id]);
  } catch (err) {
    console.error('Print invoice load error:', err.message);
  }

  if (!invoice) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#666' }}>
        <h2>⚠️ Invoice Not Found</h2>
        <p>Please verify the invoice URL or go back to the billing section.</p>
      </div>
    );
  }

  let items = [];
  try {
    items = JSON.parse(invoice.items || '[]');
  } catch (e) {
    console.error('Failed to parse items:', e);
  }

  const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';
  const HOSPITAL_PHONE = process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '+91-6396098340';
  const HOSPITAL_EMAIL = process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || 'info@omchaudharyhospital.com';
  const HOSPITAL_ADDRESS = process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || 'Najibabad - Haridwar Road, Mandawali, Bijnor, Uttar Pradesh - 246749';

  const subtotal = invoice.subtotal || invoice.total_amount || 0;
  const taxAmount = ((subtotal * (invoice.tax || 0)) / 100);
  const discount = invoice.discount || 0;
  const total = invoice.total_amount || 0;

  const statusStyle = {
    paid: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
    pending: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d' },
    partial: { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  }[invoice.payment_status] || { bg: '#f3f4f6', color: '#374151', border: '#d1d5db' };

  const issuedDate = invoice.created_at
    ? new Date(invoice.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'N/A';
  const dueDate = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
          @page { margin: 1cm; size: A4; }
        }
      `}} />

      {/* Print Controls */}
      <div className="no-print" style={{ background: '#1e293b', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="/dashboard/admin/billing" style={{ color: '#94a3b8', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Billing
        </a>
        <PrintControls backHref="/dashboard/admin/billing" />
      </div>

      <div style={{ minHeight: '100vh', padding: '32px 16px', display: 'flex', justifyContent: 'center', background: '#f0f4f8' }}>
        <div className="page" style={{
          width: '100%', maxWidth: '800px', background: 'white',
          borderRadius: '12px', boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden'
        }}>

          {/* ── HEADER STRIP ── */}
          <div style={{ background: 'linear-gradient(135deg, #0f465c 0%, #1a6b85 100%)', padding: '32px 40px', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {/* Hospital Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Logo Icon */}
                <div style={{
                  width: '60px', height: '60px', background: 'rgba(255,255,255,0.15)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.25)'
                }}>
                  <svg viewBox="0 0 24 24" fill="white" width="34" height="34">
                    <path d="M19 6h-3V3c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-9-3h4v3h-4V3zm9 17H5V8h14v12zm-6-9h-2v2H9v2h2v2h2v-2h2v-2h-2v-2z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.5px', lineHeight: 1.2 }}>
                    OM CHAUDHARY
                  </div>
                  <div style={{ fontSize: '11px', color: '#67e8f9', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>
                    Hospital & Trauma Centre
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>
                    {HOSPITAL_ADDRESS.split(',').slice(0, 3).join(',')}
                  </div>
                </div>
              </div>

              {/* Invoice Badge */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#67e8f9', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Tax Invoice
                </div>
                <div style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '1px' }}>
                  {invoice.invoice_number}
                </div>
                <div style={{
                  marginTop: '8px', display: 'inline-block', padding: '4px 14px',
                  background: statusStyle.bg, color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`, borderRadius: '20px',
                  fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  {invoice.payment_status}
                </div>
              </div>
            </div>

            {/* Info row */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>
              <span>📞 {HOSPITAL_PHONE}</span>
              <span>✉️ {HOSPITAL_EMAIL}</span>
              <span style={{ marginLeft: 'auto' }}>Issued: <strong style={{ color: 'white' }}>{issuedDate}</strong></span>
              {dueDate && <span>Due: <strong style={{ color: '#fcd34d' }}>{dueDate}</strong></span>}
            </div>
          </div>

          {/* ── PATIENT + INVOICE META ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e5e7eb' }}>
            {/* Billed To */}
            <div style={{ background: '#f8fafc', padding: '24px 32px' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                Billed To
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{invoice.patient_name}</div>
              {invoice.patient_age && <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Age: {invoice.patient_age} | {invoice.patient_gender || 'N/A'}</div>}
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>📞 {invoice.patient_phone || 'N/A'}</div>
              {invoice.patient_email && <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>✉️ {invoice.patient_email}</div>}
              {invoice.patient_address && <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: 1.5 }}>{invoice.patient_address}</div>}
            </div>

            {/* Invoice Details */}
            <div style={{ background: '#f8fafc', padding: '24px 32px' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                Invoice Details
              </div>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Invoice No.', invoice.invoice_number],
                    ['Visit Type', `${invoice.type} Visit`],
                    ['Issue Date', issuedDate],
                    ...(dueDate ? [['Payment Due', dueDate]] : []),
                    ['Payment Status', invoice.payment_status?.toUpperCase()],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ padding: '3px 0', color: '#64748b', fontWeight: 600 }}>{label}</td>
                      <td style={{ padding: '3px 0', textAlign: 'right', color: '#0f172a', fontWeight: 700 }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── ITEMS TABLE ── */}
          <div style={{ padding: '0 0 0 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f465c', color: 'white' }}>
                  <th style={{ padding: '12px 32px 12px 32px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Description</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Unit Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Qty</th>
                  <th style={{ padding: '12px 32px 12px 16px', textAlign: 'right', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '14px 32px', fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                      {item.name}
                      {idx === 0 && invoice.type === 'OPD' && (
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>
                          Outpatient Department Consultation
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', color: '#334155' }}>₹{(item.price || 0).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '13px', color: '#334155' }}>{item.qty || 1}</td>
                    <td style={{ padding: '14px 32px 14px 16px', textAlign: 'right', fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>
                      ₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── TOTALS + NOTES ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', borderTop: '2px solid #e5e7eb' }}>
            {/* Notes */}
            <div style={{ padding: '24px 32px', borderRight: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
                Terms & Notes
              </div>
              <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.7 }}>
                This is a computer-generated invoice and is valid without a physical signature.
                Kindly preserve this receipt for TPA/insurance filings or income tax purposes.
                Consultation fees are non-refundable. For billing disputes, contact the hospital
                accounts office within 7 days of issuance.
              </p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '11px', color: '#64748b' }}>
                <span>📞 {HOSPITAL_PHONE}</span>
                <span>✉️ {HOSPITAL_EMAIL}</span>
              </div>
            </div>

            {/* Totals */}
            <div style={{ padding: '24px 32px', background: '#f8fafc' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
                Summary
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '5px 0', color: '#64748b' }}>Subtotal</td>
                    <td style={{ padding: '5px 0', textAlign: 'right', color: '#0f172a', fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</td>
                  </tr>
                  {invoice.tax > 0 && (
                    <tr>
                      <td style={{ padding: '5px 0', color: '#64748b' }}>Tax ({invoice.tax}%)</td>
                      <td style={{ padding: '5px 0', textAlign: 'right', color: '#0f172a', fontWeight: 600 }}>₹{taxAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                  {discount > 0 && (
                    <tr>
                      <td style={{ padding: '5px 0', color: '#64748b' }}>Discount</td>
                      <td style={{ padding: '5px 0', textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>− ₹{discount.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={2}>
                      <div style={{ height: '1px', background: '#cbd5e1', margin: '10px 0' }} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', color: '#0f172a', fontWeight: 800, fontSize: '15px' }}>Total</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', color: '#0f465c', fontWeight: 900, fontSize: '18px' }}>₹{total.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ paddingTop: '4px', fontSize: '10px', color: '#94a3b8', textAlign: 'right' }}>
                      INR (Indian Rupees)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SIGNATURE FOOTER ── */}
          <div style={{ background: '#f1f5f9', borderTop: '1px solid #e2e8f0', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '9px' }}>
                Hospital Address
              </div>
              {HOSPITAL_ADDRESS}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ width: '140px', borderBottom: '1.5px solid #334155', height: '36px', marginBottom: '4px' }}></div>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Authorized Signatory
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                {HOSPITAL_NAME}
              </div>
            </div>
          </div>

          {/* ── BOTTOM ACCENT ── */}
          <div style={{ height: '6px', background: 'linear-gradient(90deg, #0f465c, #1a6b85, #22d3ee, #1a6b85, #0f465c)' }} />

        </div>
      </div>
    </>
  );
}
