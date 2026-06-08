import { queryD1First } from '@/lib/d1';
import PrintControls from '../PrintControls';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Print Invoice | Hospital Portal',
};

export default async function PrintInvoicePage({ params }) {
  const { id } = params;
  let invoice = null;

  try {
    invoice = await queryD1First(`
      SELECT inv.*, p.name AS patient_name, p.phone AS patient_phone, p.address AS patient_address, u.email AS patient_email
      FROM invoices inv
      JOIN patients p ON inv.patient_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE inv.id = ?
    `, [id]);
  } catch (err) {
    console.error('Print invoice load error:', err.message);
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center text-gray-500 font-semibold max-w-md mx-auto mt-20 bg-red-50 border border-red-200 rounded-3xl">
        ⚠️ Invoice not found. Please verify the URL.
      </div>
    );
  }

  let items = [];
  try {
    items = JSON.parse(invoice.items || '[]');
  } catch (e) {
    console.error('Failed to parse items json:', e);
  }

  const HOSPITAL_NAME = process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Om Chaudhary Hospital & Trauma Centre';
  const HOSPITAL_PHONE = process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '+91-6396098340';
  const HOSPITAL_EMAIL = process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || 'info@omchaudharyhospital.com';
  const HOSPITAL_ADDRESS = process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS || 'Najibabad - Haridwar Road, Mandawali, Bijnor, Uttar Pradesh - 246749';

  const statusColors = {
    paid: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    partial: 'bg-sky-50 text-sky-800 border-sky-200',
  };

  return (
    <div className="min-h-screen bg-slate-100/40 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      {/* Print Trigger & Back Control Bar (Hidden during print) */}
      <PrintControls backHref="/dashboard/admin/billing" />

      {/* Invoice Canvas */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-12 shadow-md print:shadow-none print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-gray-150">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{HOSPITAL_NAME}</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Trauma Centre & Multi-Specialty Hospital</p>
            <p className="text-xs text-gray-500 max-w-sm mt-3 leading-relaxed">{HOSPITAL_ADDRESS}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-black tracking-widest text-primary-650 uppercase">Invoice Receipt</span>
            <p className="text-xl sm:text-2xl font-mono font-bold text-gray-900 mt-1">{invoice.invoice_number}</p>
            <div className="mt-3 flex sm:justify-end">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[invoice.payment_status] || 'bg-gray-150 text-gray-750'}`}>
                {invoice.payment_status}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Metadata Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-gray-150">
          {/* Patient Details */}
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Billed To (Patient):</span>
            <p className="font-bold text-gray-900 text-base">{invoice.patient_name}</p>
            <p className="text-xs text-gray-650 mt-1">Phone: {invoice.patient_phone || 'N/A'}</p>
            {invoice.patient_email && <p className="text-xs text-gray-650 mt-1">Email: {invoice.patient_email}</p>}
            {invoice.patient_address && <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">{invoice.patient_address}</p>}
          </div>
          {/* Invoice Info */}
          <div className="flex md:justify-end">
            <div className="space-y-2 text-xs md:text-right">
              <div className="grid grid-cols-2 gap-x-4 md:flex md:flex-col md:items-end">
                <span className="text-gray-400 font-semibold">Visit Type:</span>
                <span className="font-bold text-gray-800 md:mt-0.5">{invoice.type} Visit</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 md:flex md:flex-col md:items-end">
                <span className="text-gray-400 font-semibold">Issued Date:</span>
                <span className="font-bold text-gray-800 md:mt-0.5">{new Date(invoice.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
              </div>
              {invoice.due_date && (
                <div className="grid grid-cols-2 gap-x-4 md:flex md:flex-col md:items-end">
                  <span className="text-gray-400 font-semibold">Payment Due:</span>
                  <span className="font-bold text-gray-800 md:mt-0.5">{new Date(invoice.due_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase">#</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase pl-4">Description</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right">Price</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right w-16">Qty</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-slate-50/20">
                  <td className="py-4 text-xs font-bold text-gray-400">{idx + 1}</td>
                  <td className="py-4 text-xs font-bold text-gray-900 pl-4">{item.name}</td>
                  <td className="py-4 text-xs text-gray-700 text-right">₹{(item.price || 0).toLocaleString()}</td>
                  <td className="py-4 text-xs text-gray-700 text-right">{item.qty || 1}</td>
                  <td className="py-4 text-xs font-bold text-gray-900 text-right">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 pb-8">
          {/* Notes */}
          <div className="flex-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Receipt Information & Terms:</span>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-sm">
              This is a computer-generated transaction record issued by {HOSPITAL_NAME}. Please preserve this invoice for TPA insurance filings or tax purposes. Outpatient consultation fees are valid for 7 days from the issued date.
            </p>
          </div>
          {/* Summary pricing */}
          <div className="w-full sm:w-64 text-xs space-y-2 text-right">
            <div className="flex justify-between border-b border-gray-50 pb-1.5">
              <span className="text-gray-400 font-semibold">Subtotal:</span>
              <span className="font-bold text-gray-800">₹{(invoice.subtotal || invoice.total_amount).toLocaleString()}</span>
            </div>
            {invoice.tax > 0 && (
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-400 font-semibold">Tax ({invoice.tax}%):</span>
                <span className="font-bold text-gray-800">₹{(( (invoice.subtotal || invoice.total_amount) * invoice.tax) / 100).toLocaleString()}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between border-b border-gray-50 pb-1.5">
                <span className="text-gray-400 font-semibold">Discount:</span>
                <span className="font-bold text-red-650">- ₹{invoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between pt-1.5 border-t border-gray-200">
              <span className="text-gray-900 font-black text-sm">Grand Total:</span>
              <span className="text-primary-750 font-black text-base">₹{invoice.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signature Handoff line */}
        <div className="pt-16 border-t border-gray-150 flex justify-between items-center text-[10px] text-gray-400 font-bold">
          <div>
            <p className="uppercase tracking-widest text-slate-400">Helpdesk Hotline</p>
            <p className="text-gray-700 font-black text-xs mt-1">{HOSPITAL_PHONE}</p>
            <p className="text-slate-450 mt-0.5">{HOSPITAL_EMAIL}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="w-32 border-b border-gray-300 mb-1 h-8"></div>
            <p className="uppercase tracking-widest text-slate-400">Authorized Signatory</p>
            <p className="text-slate-500 mt-0.5">{HOSPITAL_NAME}</p>
          </div>
        </div>

      </div>

      {/* Embedded print stylesheets */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          @page {
            margin: 1.5cm;
          }
        }
      ` }} />
    </div>
  );
}
