// Minimal layout for print pages — no sidebar, no header, no footer
export default function PrintLayout({ children }) {
  return (
    <div className="print-layout">
      {children}
    </div>
  );
}
