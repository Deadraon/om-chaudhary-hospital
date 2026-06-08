'use client';

export default function PrintControls({ backHref = '/dashboard/admin/billing' }) {
  return (
    <button
      onClick={() => window.print()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 18px',
        background: '#0f465c',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      🖨️ Print / Save as PDF
    </button>
  );
}
