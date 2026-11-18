import React from 'react';
import { X, ExternalLink, Download, FileText, Calendar, HardDrive } from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/formatters';

export function PreviewModal({ isOpen, document: doc, onClose }) {
  if (!isOpen || !doc) return null;

  const previewUrl = `https://drive.google.com/file/d/${doc.driveFileId}/preview`;
  const viewUrl = doc.webViewLink || `https://drive.google.com/file/d/${doc.driveFileId}/view`;
  const downloadUrl = `/api/v1/documents/${doc.id}/download`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transform scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center space-x-3 min-w-0 pr-4">
            <div className="flex items-center justify-center shrink-0 text-black dark:text-white">
              <FileText className="w-6 h-6 text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {doc.name}
              </h3>
              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{formatBytes(doc.size)}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(doc.createdAt)}
                </span>
                {doc.category && (
                  <>
                    <span>•</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: doc.category.color }}
                    >
                      {doc.category.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={downloadUrl}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition flex items-center space-x-1.5"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center space-x-1.5"
              title="Open in Google Drive"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Google Drive</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer Frame */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 overflow-hidden relative">
          <iframe
            src={previewUrl}
            title={doc.name}
            className="w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}

