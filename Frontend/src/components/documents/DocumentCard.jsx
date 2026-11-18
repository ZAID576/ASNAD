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
  ExternalLink,
  X,
} from 'lucide-react';
import { formatBytes, formatDate, getFileCategory } from '../../utils/formatters';

export function DocumentCard({
  document: doc,
  onPreview,
  onDownload,
  onToggleFavorite,
  onRename,
  onMoveCategory,
  onTrash,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fileMeta = getFileCategory(doc.mimeType, doc.name);
  const isImage = (doc.mimeType && doc.mimeType.startsWith('image/')) || fileMeta.type === 'image';
  const isPdf = doc.mimeType === 'application/pdf' || fileMeta.type === 'pdf';
  const previewThumbnailUrl = `/api/v1/documents/${doc.id}/view`;

  const handleCardClick = (e) => {
    if (e.target.closest('.no-card-click')) return;
    if (onPreview) onPreview(doc);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    if (onTrash) onTrash(doc);
    else if (onDelete) onDelete(doc);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white dark:bg-[#111620] rounded-sm border border-gray-200 dark:border-white/[0.08] hover:border-black dark:hover:border-white/40 hover:shadow-sm transition-all duration-150 flex flex-col justify-between cursor-pointer select-none"
      >
        {/* Compact Visual Thumbnail (Hero with isolated overflow-hidden) */}
        <div className="relative w-full aspect-[16/10] bg-gray-50 dark:bg-black/30 overflow-hidden rounded-t-sm flex items-center justify-center border-b border-gray-100 dark:border-white/[0.06]">
          {isImage && !imgError ? (
            <>
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 animate-pulse" />
              )}
              <img
                src={previewThumbnailUrl}
                alt={doc.name}
                loading="lazy"
                decoding="async"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : isPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-black/20 p-2 text-center">
              <FileText className="w-7 h-7 text-black dark:text-white mb-1" strokeWidth={1.5} />
              <span className="text-[9px] font-mono font-bold tracking-wider text-black dark:text-white">
                PDF DOCUMENT
              </span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-black/20 p-2 text-center">
              <FileText className="w-7 h-7 text-black dark:text-white mb-1" strokeWidth={1.5} />
              <span className="text-[9px] font-mono text-gray-500 uppercase">
                {fileMeta.label || 'FILE'}
              </span>
            </div>
          )}

          {/* Hover Eye Cue (Desktop) */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center pointer-events-none">
            <div className="w-7 h-7 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur shadow-sm flex items-center justify-center text-gray-700 dark:text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Discreet Top-Right Actions: Star & Menu */}
          <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10 no-card-click" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleFavorite && onToggleFavorite(doc.id)}
              className={`w-6 h-6 rounded-md backdrop-blur-sm flex items-center justify-center transition-colors ${
                doc.isFavorite
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white'
              }`}
              title={doc.isFavorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Star className={`w-3 h-3 ${doc.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-6 h-6 rounded-md bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white/80 hover:text-white flex items-center justify-center transition-colors"
              title="Actions"
            >
              <MoreVertical className="w-3 h-3" />
            </button>
          </div>

          {/* Thumbnail Size Tag */}
          <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/50 backdrop-blur text-[9px] font-mono text-white/80 pointer-events-none">
            {formatBytes(doc.size)}
          </div>
        </div>

        {/* Desktop Context Popover (Outside thumbnail overflow) */}
        {menuOpen && (
          <div className="hidden sm:block no-card-click" onClick={(e) => e.stopPropagation()}>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-1.5 top-8 w-36 bg-white dark:bg-[#181E29] rounded-lg shadow-xl border border-gray-200 dark:border-white/10 py-1 z-50 text-[11px] text-left animate-in fade-in zoom-in-95 duration-100 font-medium">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (onPreview) onPreview(doc);
                }}
                className="w-full px-2.5 py-1.5 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <Eye className="w-3 h-3 text-gray-400" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  window.open(`/api/v1/documents/${doc.id}/view`, '_blank');
                }}
                className="w-full px-2.5 py-1.5 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <ExternalLink className="w-3 h-3 text-gray-400" />
                <span>Open in Tab</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (onDownload) onDownload(doc);
                }}
                className="w-full px-2.5 py-1.5 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <Download className="w-3 h-3 text-gray-400" />
                <span>Download</span>
              </button>

              {onRename && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(doc);
                  }}
                  className="w-full px-2.5 py-1.5 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <Edit2 className="w-3 h-3 text-gray-400" />
                  <span>Rename</span>
                </button>
              )}

              {onMoveCategory && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveCategory(doc);
                  }}
                  className="w-full px-2.5 py-1.5 flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <FolderSymlink className="w-3 h-3 text-gray-400" />
                  <span>Category</span>
                </button>
              )}

              <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />

              <button
                onClick={handleDelete}
                className="w-full px-2.5 py-1.5 flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="w-3 h-3" />
                <span>Move to Trash</span>
              </button>
            </div>
          </div>
        )}

        {/* Card Info Area */}
        <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1">
          <h4 className="text-[11px] sm:text-xs font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={doc.name}>
            {doc.name}
          </h4>

          {/* Enterprise Subtle Metadata */}
          <div className="mt-1 flex items-center justify-between gap-1 text-[10px] text-gray-400">
            <div className="truncate">
              {doc.category ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/[0.06] border border-gray-200/60 dark:border-white/[0.08] px-1.5 py-0.2 rounded-full truncate max-w-[90px]">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: doc.category.color }}
                  />
                  <span className="truncate">{doc.category.name}</span>
                </span>
              ) : (
                <span className="text-gray-400 text-[10px]">Uncategorized</span>
              )}
            </div>

            <span className="text-[10px] text-gray-400 flex-shrink-0">
              {formatDate(doc.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Native Action Sheet (Bottom Sheet) - Fixes cut-off completely! */}
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs no-card-click"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full bg-white dark:bg-[#161B24] rounded-t-2xl p-4 border-t border-gray-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-3" />

            {/* Document Header in Sheet */}
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-gray-100 dark:border-white/10">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-white/10">
                {isImage && !imgError ? (
                  <img src={previewThumbnailUrl} alt={doc.name} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{doc.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatBytes(doc.size)} • {formatDate(doc.createdAt)}</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions list */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (onPreview) onPreview(doc);
                }}
                className="w-full py-2.5 px-3 flex items-center gap-3 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition"
              >
                <Eye className="w-4 h-4 text-blue-500" />
                <span>Preview Document</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  window.open(`/api/v1/documents/${doc.id}/view`, '_blank');
                }}
                className="w-full py-2.5 px-3 flex items-center gap-3 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition"
              >
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Open in New Tab</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (onDownload) onDownload(doc);
                }}
                className="w-full py-2.5 px-3 flex items-center gap-3 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition"
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span>Download File</span>
              </button>

              {onRename && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(doc);
                  }}
                  className="w-full py-2.5 px-3 flex items-center gap-3 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition"
                >
                  <Edit2 className="w-4 h-4 text-amber-500" />
                  <span>Rename</span>
                </button>
              )}

              {onMoveCategory && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onMoveCategory(doc);
                  }}
                  className="w-full py-2.5 px-3 flex items-center gap-3 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition"
                >
                  <FolderSymlink className="w-4 h-4 text-indigo-500" />
                  <span>Move Category</span>
                </button>
              )}

              <div className="h-px bg-gray-100 dark:bg-white/10 my-1.5" />

              <button
                onClick={handleDelete}
                className="w-full py-2.5 px-3 flex items-center gap-3 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Move to Trash</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
