import React, { useState, useEffect, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Files,
  FolderTree,
  Star,
  HardDrive,
  CloudUpload,
  Plus,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/dashboardApi';
import { categoryApi } from '../api/categoryApi';
import { documentApi } from '../api/documentApi';
import { Button } from '../components/common/Button';
import { DocumentCard } from '../components/documents/DocumentCard';
import { EmptyState } from '../components/common/EmptyState';
import { DocumentPreviewModal } from '../components/documents/DocumentPreviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CategoryModal } from '../components/categories/CategoryModal';
import { useToast } from '../context/ToastContext';
import { getCache, setCache, clearCache } from '../utils/cache';

export const DashboardPage = () => {
  const { user, driveStatus } = useAuth();
  const { openUploadModal } = useOutletContext() || {};
  const toast = useToast();

  // Instant SWR state: Initialize immediately from cache or defaults (0ms wait, no skeletons)
  const [metrics, setMetrics] = useState(() =>
    getCache('asnad_dash_metrics', {
      totalDocuments: 0,
      totalFavorites: 0,
      totalTrash: 0,
      totalCategories: 0,
      totalBytesUsed: 0,
      formattedStorage: '0 B',
    })
  );
  const [recentDocuments, setRecentDocuments] = useState(() =>
    getCache('asnad_dash_recent', [])
  );
  const [categories, setCategories] = useState(() =>
    getCache('asnad_categories', [])
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [summaryRes, categoriesRes] = await Promise.all([
        dashboardApi.getSummary(),
        categoryApi.list(),
      ]);

      if (summaryRes.success && summaryRes.data) {
        setMetrics(summaryRes.data.metrics);
        setRecentDocuments(summaryRes.data.recentDocuments || []);
        setCache('asnad_dash_metrics', summaryRes.data.metrics, 60);
        setCache('asnad_dash_recent', summaryRes.data.recentDocuments || [], 60);
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data.categories || []);
        setCache('asnad_categories', categoriesRes.data.categories || [], 60);
      }
    } catch (err) {
      console.warn('Dashboard background refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);

    // Listen for global uploads & invalidate cache
    const handleUploaded = () => {
      clearCache('asnad_');
      fetchDashboardData(true);
    };
    window.addEventListener('documentUploaded', handleUploaded);
    return () => window.removeEventListener('documentUploaded', handleUploaded);
  }, [fetchDashboardData]);

  const handleToggleFavorite = async (docId) => {
    try {
      const res = await documentApi.toggleFavorite(docId);
      if (res.success) {
        setRecentDocuments((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, isFavorite: res.data.isFavorite } : d))
        );
        fetchDashboardData();
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
        fetchDashboardData();
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
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            Manage, organize, and access your personal documents securely.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setCategoryModalOpen(true)}
            className="text-xs py-1.5 px-2.5 sm:px-3"
          >
            New Category
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={CloudUpload}
            onClick={openUploadModal}
            className="text-xs py-1.5 px-3"
          >
            Upload File
          </Button>
        </div>
      </div>

      {/* Google Drive Status Banner Card (Compact) */}
      <div
        className={`px-3 py-2 sm:p-3.5 rounded-xl border transition-all ${
          driveStatus?.connected
            ? 'bg-white dark:bg-surface-dark-card border-gray-200/80 dark:border-surface-dark-border shadow-xs'
            : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <HardDrive className="w-5 h-5 text-black dark:text-white flex-shrink-0" strokeWidth={1.75} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  Google Drive
                </span>
                {driveStatus?.connected ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded-sm border border-blue-200">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded-sm border border-gray-200">
                    <AlertCircle className="w-2.5 h-2.5" /> Not Connected
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                {driveStatus?.connected
                  ? `Linked to ${driveStatus.googleAccountEmail || driveStatus.googleEmail || 'Google Drive'}`
                  : 'Connect Drive for cloud storage'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Link to="/settings">
              <Button
                variant={driveStatus?.connected ? 'outline' : 'primary'}
                size="sm"
                icon={driveStatus?.connected ? ExternalLink : HardDrive}
                className="text-[11px] sm:text-xs py-1 px-2 sm:px-2.5"
              >
                {driveStatus?.connected ? 'Manage' : 'Connect'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Row (Clean Minimalist White/Black/Blue Strip) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
        <Link
          to="/documents"
          className="p-2 sm:p-3 bg-white dark:bg-surface-dark-card rounded-sm border border-gray-200 dark:border-surface-dark-border shadow-xs hover:border-black transition-all text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-between text-gray-400 mb-0.5 sm:mb-1">
            <span className="text-[9px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider truncate">
              Docs
            </span>
            <Files className="w-3.5 h-3.5 text-black dark:text-white hidden sm:block" strokeWidth={1.75} />
          </div>
          <div className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {metrics.totalDocuments}
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 hidden sm:block">Active files</p>
        </Link>

        <Link
          to="/categories"
          className="p-2 sm:p-3 bg-white dark:bg-surface-dark-card rounded-sm border border-gray-200 dark:border-surface-dark-border shadow-xs hover:border-black transition-all text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-between text-gray-400 mb-0.5 sm:mb-1">
            <span className="text-[9px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider truncate">
              Folders
            </span>
            <FolderTree className="w-3.5 h-3.5 text-black dark:text-white hidden sm:block" strokeWidth={1.75} />
          </div>
          <div className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {metrics.totalCategories}
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 hidden sm:block">Categories</p>
        </Link>

        <Link
          to="/favorites"
          className="p-2 sm:p-3 bg-white dark:bg-surface-dark-card rounded-sm border border-gray-200 dark:border-surface-dark-border shadow-xs hover:border-black transition-all text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-between text-gray-400 mb-0.5 sm:mb-1">
            <span className="text-[9px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider truncate">
              Starred
            </span>
            <Star className="w-3.5 h-3.5 text-black dark:text-white hidden sm:block" strokeWidth={1.75} />
          </div>
          <div className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {metrics.totalFavorites}
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 hidden sm:block">Favorite files</p>
        </Link>

        <div className="p-2 sm:p-3 bg-white dark:bg-surface-dark-card rounded-sm border border-gray-200 dark:border-surface-dark-border shadow-xs text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-between text-gray-400 mb-0.5 sm:mb-1">
            <span className="text-[9px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider truncate">
              Storage
            </span>
            <HardDrive className="w-3.5 h-3.5 text-black dark:text-white hidden sm:block" strokeWidth={1.75} />
          </div>
          <div className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white truncate">
            {metrics.formattedStorage || '0 B'}
          </div>
          <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5 hidden sm:block">Google Drive</p>
        </div>
      </div>

      {/* Category Quick Chips */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Filter by Category</span>
            <Link to="/categories" className="text-brand-blue hover:underline lowercase text-[11px]">
              view all ({categories.length})
            </Link>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Link
              to="/documents"
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-surface-dark-card border border-gray-200 dark:border-surface-dark-border hover:border-brand-blue text-gray-700 dark:text-gray-300 flex-shrink-0 transition-colors"
            >
              All Files
            </Link>
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/documents?category=${cat.id}`}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 flex-shrink-0 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${cat.color}10`,
                  borderColor: `${cat.color}35`,
                  color: cat.color,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.documentCount})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Documents Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Recent Documents
            </h2>
          </div>
          <Link
            to="/documents"
            className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
          >
            View All Documents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDocuments.length === 0 ? (
          <EmptyState
            title="No documents uploaded yet"
            description="Upload your first document or connect Google Drive to import files seamlessly."
            actionLabel="Upload First Document"
            onAction={openUploadModal}
            actionIcon={CloudUpload}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
            {recentDocuments.map((doc) => (
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
      </div>

      {/* Modals */}
      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
        categories={categories}
        onDocumentUpdated={(updated) => {
          setPreviewDoc(null);
          fetchDashboardData();
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Move to Trash?"
        message={`"${deleteTarget?.name}" will be moved to the Trash bin. You can restore it anytime.`}
        confirmText="Move to Trash"
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />
    </div>
  );
};
