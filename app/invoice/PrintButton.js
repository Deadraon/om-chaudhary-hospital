'use client';
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '8px 20px', background: '#0f465c', color: 'white',
        border: 'none', borderRadius: '8px', fontSize: '13px',
        fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px',
      }}
    >
      🖨️ Print / Save PDF
    </button>
  );
}
