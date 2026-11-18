import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  HardDrive,
  Check,
  Edit2,
  FileText,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/formatters';
import { documentApi } from '../../api/documentApi';
import { useToast } from '../../context/ToastContext';

export const DocumentPreviewModal = ({
  isOpen,
  onClose,
  document: doc,
  categories = [],
  onDocumentUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const toast = useToast();

  useEffect(() => {
    if (doc) {
      setName(doc.name || '');
      setIsEditing(false);
      setImageLoading(true);
      setImageError(false);
      setZoom(1);
    }
  }, [doc]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !doc) return null;

  const mime = doc.mimeType || '';
  const isImage = mime.startsWith('image/');
  const isPdf = mime === 'application/pdf';
  const previewUrl = documentApi.getViewUrl(doc.id);
  const downloadUrl = documentApi.getDownloadUrl(doc.id);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await documentApi.update(doc.id, {
        name: name.trim(),
      });
      if (res.success) {
        toast.success('Renamed successfully');
        setIsEditing(false);
        if (onDocumentUpdated) onDocumentUpdated(res.data.document);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update document');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  const handleOpenNewTab = () => {
    window.open(previewUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
        {/* Backdrop dismiss click */}
        <div className="fixed inset-0 -z-10" onClick={onClose} />

        {/* Modal Window: Fullscreen on mobile, floating cinema on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="relative w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl lg:max-w-5xl sm:rounded-2xl bg-[#0B0F17] text-slate-100 border border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0F141F] border-b border-slate-800/80 z-20">
            {/* Left: File Title & Category Badge */}
            <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
              <div className="flex items-center justify-center flex-shrink-0 text-white">
                {isImage ? <ImageIcon className="w-5 h-5" strokeWidth={1.5} /> : <FileText className="w-5 h-5" strokeWidth={1.5} />}
              </div>

              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                      className="w-full bg-slate-800 text-white text-xs sm:text-sm rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                      {doc.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      {doc.category && (
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium text-white truncate max-w-[120px]"
                          style={{ backgroundColor: doc.category.color }}
                        >
                          {doc.category.name}
                        </span>
                      )}
                      <span className="text-slate-400 font-mono text-[11px]">
                        {formatBytes(doc.size)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions & Close Button */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleOpenNewTab}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/60 transition"
                title="Open in new browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Open in Tab</span>
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition active:scale-95"
                title="Download document"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition ml-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Viewport Canvas */}
          <div className="relative flex-1 w-full min-h-[350px] sm:min-h-[460px] max-h-[70vh] flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none bg-[#070A0F]">
            {isImage ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-auto">
                {imageLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#070A0F]/80 z-10">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">Loading high resolution image...</span>
                  </div>
                )}

                {imageError ? (
                  <div className="flex flex-col items-center gap-3 p-6 text-center max-w-sm">
                    <AlertCircle className="w-10 h-10 text-amber-500" />
                    <p className="text-sm font-semibold text-slate-300">
                      Preview failed to load inside modal
                    </p>
                    <button
                      onClick={handleOpenNewTab}
                      className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center gap-1.5 border border-slate-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                    </button>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt={doc.name}
                    loading="lazy"
                    decoding="async"
                    style={{
                      transform: `scale(${zoom})`,
                      transition: 'transform 0.15s ease-out',
                    }}
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                    className="max-w-full max-h-[64vh] object-contain rounded-xl shadow-2xl transition-transform"
                  />
                )}

                {/* Floating Zoom Bar */}
                {!imageLoading && !imageError && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl shadow-xl z-20">
                    <button
                      onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                      className="p-1.5 hover:bg-slate-800 active:scale-95 rounded-lg text-slate-400 hover:text-white transition"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] font-mono px-2 text-slate-300 min-w-[42px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                      className="p-1.5 hover:bg-slate-800 active:scale-95 rounded-lg text-slate-400 hover:text-white transition"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoom(1)}
                      className="p-1.5 hover:bg-slate-800 active:scale-95 rounded-lg text-slate-400 hover:text-white transition ml-0.5 border-l border-slate-800"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : isPdf ? (
              <div className="w-full h-[65vh] relative bg-white rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src={`${previewUrl}#toolbar=1&navpanes=0`}
                  title={doc.name}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              /* Non-image file card */
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center max-w-md">
                <div className="flex items-center justify-center text-white mb-2">
                  <FileText className="w-12 h-12" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct inline preview is not supported for this file type.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleOpenNewTab}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white flex items-center gap-1.5 border border-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                  </button>
                  {doc.webViewLink && (
                    <button
                      onClick={() => window.open(doc.webViewLink, '_blank')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white flex items-center gap-1.5"
                    >
                      <HardDrive className="w-3.5 h-3.5" /> Open in Drive
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Meta info strip */}
          <div className="px-4 sm:px-6 py-3 bg-[#0F141F] border-t border-slate-800/80 z-20 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4 truncate">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {formatDate(doc.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                Google Drive
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
                {doc.mimeType}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded-md hover:bg-slate-800/60 transition"
                >
                  <Edit2 className="w-3 h-3" />
                  Rename
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
