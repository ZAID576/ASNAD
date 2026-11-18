import React, { useState, useEffect, useCallback } from 'react';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  File,
  HardDrive,
  Calendar,
} from 'lucide-react';
import { trashApi } from '../api/trashApi';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { getFileIcon, formatBytes, formatDate } from '../utils/fileHelpers';
import { useToast } from '../context/ToastContext';
import { getCache, setCache } from '../utils/cache';

export const TrashPage = () => {
  const [trashItems, setTrashItems] = useState(() => getCache('asnad_trash', []));

  // Modals state
  const [permanentTarget, setPermanentTarget] = useState(null);
  const [deleteFromDrive, setDeleteFromDrive] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const fetchTrash = useCallback(async (silent = false) => {
    try {
      const res = await trashApi.list();
      if (res.success) {
        const items = res.data?.trash || res.data?.documents || [];
        setTrashItems(items);
        setCache('asnad_trash', items, 60);
      }
    } catch (err) {
      if (!silent) toast.error('Failed to load trash items');
    }
  }, [toast]);

  useEffect(() => {
    fetchTrash(true);
  }, [fetchTrash]);

  const handleRestore = async (id, name) => {
    try {
      const res = await trashApi.restore(id);
      if (res.success) {
        toast.success(`"${name}" restored successfully`);
        fetchTrash();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to restore document');
    }
  };

  const handlePermanentDelete = async () => {
    if (!permanentTarget) return;

    setDeleting(true);
    try {
      const res = await trashApi.permanentDelete(permanentTarget.id, deleteFromDrive);
      if (res.success) {
        toast.success(`"${permanentTarget.name}" deleted permanently`);
        setPermanentTarget(null);
        fetchTrash();
      }
    } catch (err) {
      toast.error(err.message || 'Permanent deletion failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          Trash Bin
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
            {trashItems.length}
          </span>
        </h1>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
          Items here can be restored to your vault or deleted forever.
        </p>
      </div>

      {trashItems.length === 0 ? (
        <EmptyState
          icon={Trash2}
          title="Trash is empty"
          description="Documents moved to trash will appear here for safe recovery."
        />
      ) : (
        <div className="space-y-2">
          {trashItems.map((item) => {
            const { icon: Icon, color, bg } = getFileIcon(item.mimeType);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 sm:p-3.5 bg-white dark:bg-surface-dark-card border border-gray-200/80 dark:border-surface-dark-border rounded-xl shadow-xs"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 pr-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 text-black dark:text-white">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <span>{formatBytes(item.size)}</span>
                      <span>•</span>
                      <span>Deleted {formatDate(item.updatedAt)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleRestore(item.id, item.name)}
                    className="p-1 sm:p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition"
                    title="Restore file"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setPermanentTarget(item);
                      setDeleteFromDrive(true);
                    }}
                    className="p-1 sm:p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Permanent Deletion Confirmation Modal */}
      <Modal
        isOpen={!!permanentTarget}
        onClose={() => setPermanentTarget(null)}
        title="Delete Document Permanently?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-3 text-xs text-rose-900 dark:text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">This action cannot be undone</span>
              Are you sure you want to permanently delete{' '}
              <strong>"{permanentTarget?.name}"</strong>?
            </div>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-surface-dark-border/40 rounded-xl border border-gray-100 dark:border-surface-dark-border">
            <label className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteFromDrive}
                onChange={(e) => setDeleteFromDrive(e.target.checked)}
                className="mt-0.5 rounded text-brand-red focus:ring-brand-red"
              />
              <span>
                <strong>Also delete original file from Google Drive</strong>
                <span className="block text-[11px] text-gray-500 mt-0.5">
                  If unchecked, only the Asnad reference is removed while keeping the file in your Google Drive.
                </span>
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-surface-dark-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPermanentTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handlePermanentDelete}
              loading={deleting}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
