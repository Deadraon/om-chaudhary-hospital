'use client';

import Link from 'next/link';

export default function PrintControls({ backHref = '/dashboard/admin/billing' }) {
  return (
    <div className="max-w-4xl mx-auto mb-6 bg-white border border-gray-150 p-4 rounded-2xl shadow-sm flex justify-between items-center print:hidden">
      <Link
        href={backHref}
        className="text-xs text-gray-650 hover:text-gray-900 font-bold flex items-center gap-1"
      >
        ← Back to Registry
      </Link>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-98"
      >
        🖨️ Print / Save as PDF
      </button>
    </div>
  );
}
