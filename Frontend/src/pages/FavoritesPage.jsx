import React, { useState, useEffect, useCallback } from 'react';
import { Star, CloudUpload } from 'lucide-react';
import { documentApi } from '../api/documentApi';
import { DocumentCard } from '../components/documents/DocumentCard';
import { EmptyState } from '../components/common/EmptyState';
import { DocumentPreviewModal } from '../components/documents/DocumentPreviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { getCache, setCache } from '../utils/cache';

export const FavoritesPage = () => {
  const [documents, setDocuments] = useState(() => getCache('asnad_favorites', []));
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToast();

  const fetchFavorites = useCallback(async (silent = false) => {
    try {
      const res = await documentApi.list({ isFavorite: 'true', limit: 50 });
      if (res.success) {
        setDocuments(res.data.documents || []);
        setCache('asnad_favorites', res.data.documents || [], 60);
      }
    } catch (err) {
      if (!silent) toast.error('Failed to load favorite documents');
    }
  }, [toast]);

  useEffect(() => {
    fetchFavorites(true);
  }, [fetchFavorites]);

  const handleToggleFavorite = async (docId) => {
    try {
      const res = await documentApi.toggleFavorite(docId);
      if (res.success) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
        toast.info('Removed from favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorite');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await documentApi.deleteDoc(deleteTarget.id);
      if (res.success) {
        toast.success(`"${deleteTarget.name}" moved to trash`);
        setDeleteTarget(null);
        fetchFavorites();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to move to trash');
    }
  };

  const handleDownload = (doc) => {
    window.open(documentApi.getDownloadUrl(doc.id), '_blank');
  };

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Starred Documents
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            {documents.length}
          </span>
        </h1>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
          Quickly access your most frequently used and important files.
        </p>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No starred documents"
          description="Click the star icon on any document to add it to your favorites for instant access."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPreview={(d) => setPreviewDoc(d)}
              onToggleFavorite={handleToggleFavorite}
              onDelete={(d) => setDeleteTarget(d)}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        onDocumentUpdated={() => {
          setPreviewDoc(null);
          fetchFavorites();
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash?"
        message={`"${deleteTarget?.name}" will be moved to the Trash bin.`}
        confirmText="Move to Trash"
      />
    </div>
  );
};
