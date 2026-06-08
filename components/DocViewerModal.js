'use client';

import Modal from './Modal';

export default function DocViewerModal({ isOpen, onClose, fileUrl, title }) {
  if (!fileUrl) return null;
  
  const isPDF = fileUrl.toLowerCase().endsWith('.pdf') || fileUrl.includes('/lab-reports/') && !fileUrl.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Document Viewer'} size="full">
      <div className="w-full h-full">
        {isPDF ? (
          <iframe
            src={`${fileUrl}#toolbar=1`}
            className="w-full h-[calc(100vh-50px)] border-0"
            title="PDF Document Viewer"
          ></iframe>
        ) : (
          <div className="w-full h-[calc(100vh-50px)] flex items-center justify-center bg-slate-50 overflow-auto">
            <img
              src={fileUrl}
              alt={title || 'Document Attachment'}
              className="max-w-full max-h-full object-contain shadow-md"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
