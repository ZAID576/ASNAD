import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  SortDesc,
  Plus,
  CloudUpload,
  Files,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { documentApi } from '../api/documentApi';
import { categoryApi } from '../api/categoryApi';
import { DocumentCard } from '../components/documents/DocumentCard';
import { DocumentListItem } from '../components/documents/DocumentListItem';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { DocumentPreviewModal } from '../components/documents/DocumentPreviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { getCache, setCache, clearCache } from '../utils/cache';

export const DocumentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openUploadModal } = useOutletContext() || {};
  const toast = useToast();

  // Filter & Search states from query params
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const onlyFavorites = searchParams.get('favorites') === 'true';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const cacheKey = `asnad_docs_${page}_${searchQuery}_${selectedCategory}_${onlyFavorites}`;
  const [documents, setDocuments] = useState(() => getCache(cacheKey, []));
  const [categories, setCategories] = useState(() => getCache('asnad_categories', []));
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isFetching, setIsFetching] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.list();
      if (res.success) {
        setCategories(res.data.categories || []);
        setCache('asnad_categories', res.data.categories || [], 60);
      }
    } catch (err) {
      console.warn('Failed to load categories');
    }
  };

  const fetchDocuments = useCallback(async (silent = false) => {
    if (!silent && !documents.length) setIsFetching(true);
    try {
      const res = await documentApi.list({
        page,
        limit: 18,
        search: searchQuery,
        categoryId: selectedCategory,
        isFavorite: onlyFavorites ? 'true' : undefined,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setDocuments(res.data.documents || []);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
        setCache(cacheKey, res.data.documents || [], 45);
      }
    } catch (err) {
      toast.error('Failed to load documents');
    } finally {
      setIsFetching(false);
    }
  }, [page, searchQuery, selectedCategory, onlyFavorites, sortBy, sortOrder, cacheKey]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDocuments(true);
  }, [fetchDocuments]);

  // Update query params helper
  const updateFilter = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value.toString());
      }
    });
    // Reset page to 1 on filter change if not changing page directly
    if (!('page' in updates)) {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const handleToggleFavorite = async (docId) => {
    try {
      const res = await documentApi.toggleFavorite(docId);
      if (res.success) {
        setDocuments((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, isFavorite: res.data.isFavorite } : d))
        );
      }
    } catch (err) {
      toast.error('Could not update favorite');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await documentApi.deleteDoc(deleteTarget.id);
      if (res.success) {
        toast.success(`"${deleteTarget.name}" moved to trash`);
        setDeleteTarget(null);
        fetchDocuments();
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Documents
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-dark-border text-gray-600 dark:text-gray-300">
              {pagination.total}
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            Browse, search, and manage all files stored in your Google Drive.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={CloudUpload}
          onClick={openUploadModal}
          className="text-xs py-1.5 px-3 self-start sm:self-auto"
        >
          Upload Document
        </Button>
      </div>

      {/* Filter and Control Bar (Compact & Responsive) */}
      <div className="p-2 sm:p-3 bg-white dark:bg-surface-dark-card border border-gray-200/80 dark:border-surface-dark-border rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateFilter({ search: e.target.value })}
            placeholder="Search documents..."
            className="w-full pl-8 pr-7 py-1 text-xs bg-gray-50 dark:bg-surface-dark-border/40 border border-gray-200 dark:border-surface-dark-border rounded-lg focus:outline-none focus:border-brand-blue"
          />
          {searchQuery && (
            <button
              onClick={() => updateFilter({ search: '' })}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category & Sort controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => updateFilter({ category: e.target.value })}
            className="text-[11px] sm:text-xs py-1 px-2 sm:px-2.5 rounded-lg border border-gray-200 dark:border-surface-dark-border bg-gray-50 dark:bg-surface-dark-border/40 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-blue flex-1 sm:flex-none"
          >
            <option value="">All Categories</option>
            <option value="uncategorized">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.documentCount})
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split(':');
              updateFilter({ sortBy: sb, sortOrder: so });
            }}
            className="text-[11px] sm:text-xs py-1 px-2 sm:px-2.5 rounded-lg border border-gray-200 dark:border-surface-dark-border bg-gray-50 dark:bg-surface-dark-border/40 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-blue flex-1 sm:flex-none"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="size:desc">Size (Largest)</option>
            <option value="size:asc">Size (Smallest)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 dark:border-surface-dark-border rounded-lg overflow-hidden bg-gray-50 dark:bg-surface-dark-border/40">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 sm:p-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-surface-dark-card text-brand-blue shadow-sm'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 sm:p-1.5 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-surface-dark-card text-brand-blue shadow-sm'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Grid / List */}
      {documents.length === 0 ? (
        <EmptyState
          title="No matching documents found"
          description={
            searchQuery || selectedCategory
              ? 'Try adjusting your search criteria or filters.'
              : 'Start by uploading your first document or importing from Google Drive.'
          }
          actionLabel={searchQuery || selectedCategory ? 'Clear Filters' : 'Upload Document'}
          onAction={() => {
            if (searchQuery || selectedCategory) {
              setSearchParams(new URLSearchParams());
            } else {
              openUploadModal();
            }
          }}
        />
      ) : viewMode === 'grid' ? (
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
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <DocumentListItem
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

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-surface-dark-border text-xs text-gray-500">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrev}
              onClick={() => updateFilter({ page: page - 1 })}
              icon={ChevronLeft}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => updateFilter({ page: page + 1 })}
            >
              Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        categories={categories}
        onDocumentUpdated={() => {
          setPreviewDoc(null);
          fetchDocuments();
        }}
      />

      {/* Move to Trash Confirm Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash?"
        message={`"${deleteTarget?.name}" will be moved to the Trash bin. You can restore it anytime.`}
        confirmText="Move to Trash"
      />
    </div>
  );
};
