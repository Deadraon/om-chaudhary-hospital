'use client';

import Modal from './Modal';

export default function DocViewerModal({ isOpen, onClose, fileUrl, title }) {
  if (!fileUrl) return null;
  
  const isPDF = fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.includes('/lab-reports/') && !fileUrl.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Document Viewer'} size="lg">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-end gap-2">
          <a
            href={fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            📥 Download / Print Original
          </a>
        </div>
        
        <div className="bg-slate-50 border border-gray-150 rounded-2xl overflow-hidden flex items-center justify-center p-2 min-h-[50vh]">
          {isPDF ? (
            <iframe
              src={`${fileUrl}#toolbar=1`}
              className="w-full h-[65vh] rounded-xl"
              title="PDF Document Viewer"
            ></iframe>
          ) : (
            <div className="overflow-auto max-h-[65vh] flex items-center justify-center">
              <img
                src={fileUrl}
                alt={title || 'Document Attachment'}
                className="max-w-full h-auto object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
