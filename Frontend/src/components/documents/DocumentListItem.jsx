import React, { useState } from 'react';
import { Star, Download, Trash2, Eye, MoreHorizontal, ExternalLink } from 'lucide-react';
import { getFileIcon, formatBytes, formatDate } from '../../utils/fileHelpers';
import { Badge } from '../common/Badge';

export const DocumentListItem = ({
  document,
  onPreview,
  onToggleFavorite,
  onDelete,
  onDownload,
}) => {
  const [imgError, setImgError] = useState(false);
  const { icon: Icon, color, bg } = getFileIcon(document.mimeType);
  const isImage = document.mimeType && document.mimeType.startsWith('image/');
  const previewThumbnailUrl = `/api/v1/documents/${document.id}/view`;

  return (
    <div className="group flex items-center justify-between p-2.5 sm:p-3.5 bg-white dark:bg-surface-dark-card border border-gray-200/80 dark:border-surface-dark-border rounded-xl hover:shadow-sm hover:border-brand-blue/30 transition-all">
      {/* File info */}
      <div
        onClick={() => onPreview && onPreview(document)}
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer pr-2"
      >
        {isImage && !imgError ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200/60 dark:border-slate-800">
            <img
              src={previewThumbnailUrl}
              alt={document.name}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-black dark:text-white">
            <Icon className="w-5 h-5 text-black dark:text-white" strokeWidth={1.5} />
          </div>
        )}

        <div className="flex flex-col min-w-0">
          <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-blue transition-colors">
            {document.name}
          </span>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 mt-0.5">
            <span>{formatBytes(document.size)}</span>
            <span>•</span>
            <span>{formatDate(document.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Category badge */}
      <div className="hidden sm:block mr-4 flex-shrink-0">
        {document.category ? (
          <Badge color={document.category.color} size="xs">
            {document.category.name}
          </Badge>
        ) : (
          <span className="text-xs text-gray-400">Uncategorized</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onToggleFavorite && onToggleFavorite(document.id)}
          className={`p-1.5 rounded-lg transition-colors ${
            document.isFavorite
              ? 'text-brand-yellow'
              : 'text-gray-300 dark:text-gray-600 hover:text-gray-500'
          }`}
          title="Favorite"
        >
          <Star className={`w-4 h-4 ${document.isFavorite ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={() => window.open(previewThumbnailUrl, '_blank')}
          className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDownload && onDownload(document)}
          className="p-1.5 text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete && onDelete(document)}
          className="p-1.5 text-gray-400 hover:text-brand-red hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
          title="Move to trash"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
