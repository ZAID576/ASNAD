import React, { useState } from 'react';
import {
  FileText,
  Star,
  MoreVertical,
  Download,
  Eye,
  Edit2,
  FolderSymlink,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import { formatBytes, formatDate, getFileCategory } from '../../utils/formatters';

export function DocumentRow({
  document: doc,
  onPreview,
  onDownload,
  onToggleFavorite,
  onRename,
  onMoveCategory,
  onTrash,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileMeta = getFileCategory(doc.mimeType, doc.name);

  return (
    <div
      onClick={() => onPreview(doc)}
      className="group flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-sm border border-gray-200 dark:border-slate-800 hover:border-black transition cursor-pointer"
    >
      <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-3">
        {/* Raw Black Icon, No Background Box */}
        <FileText className="w-5 h-5 text-black dark:text-white shrink-0" strokeWidth={1.5} />

        {/* Name and details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {doc.name}
            </h4>
            {doc.sourceType === 'drive_import_link' && (
              <span title="Linked from Google Drive" className="text-slate-400 shrink-0">
                <LinkIcon className="w-3 h-3" />
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{formatBytes(doc.size)}</span>
            <span>•</span>
            <span>{formatDate(doc.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Category Pill */}
      <div className="hidden sm:block px-3">
        {doc.category ? (
          <span
            className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-[10px] text-white truncate max-w-[120px]"
            style={{ backgroundColor: doc.category.color }}
          >
            {doc.category.name}
          </span>
        ) : (
          <span className="text-xs text-slate-400">Uncategorized</span>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center space-x-1 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onToggleFavorite(doc.id)}
          className={`p-1.5 rounded-lg transition ${
            doc.isFavorite
              ? 'text-amber-500 fill-amber-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={() => onDownload(doc)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onPreview(doc);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    window.open(`/api/v1/documents/${doc.id}/view`, '_blank');
                  }}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in New Tab</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(doc);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveCategory(doc);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                >
                  <FolderSymlink className="w-3.5 h-3.5" />
                  <span>Move Category</span>
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onTrash(doc);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Move to Trash</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

