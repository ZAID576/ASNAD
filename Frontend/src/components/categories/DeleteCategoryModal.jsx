import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertTriangle } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';

export const DeleteCategoryModal = ({
  isOpen,
  onClose,
  category,
  otherCategories = [],
  onSuccess,
}) => {
  const [reassignTo, setReassignTo] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!category) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.deleteCat(category.id, reassignTo || null);
      if (res.success) {
        toast.success(`Category "${category.name}" deleted`);
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const eligibleTargets = otherCategories.filter((c) => c.id !== category.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Category"
      subtitle={`Are you sure you want to delete "${category.name}"?`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Documents will NOT be deleted</span>
            This category has <strong>{category.documentCount || 0}</strong> document(s). Choose where to reassign them:
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
            Reassign Documents To
          </label>
          <select
            value={reassignTo}
            onChange={(e) => setReassignTo(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-surface-dark-border bg-white dark:bg-surface-dark-card text-gray-900 dark:text-gray-100 text-sm py-2 px-3 focus:outline-none focus:border-brand-blue"
          >
            <option value="">(Keep Uncategorized)</option>
            {eligibleTargets.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-surface-dark-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={loading}
          >
            Delete Category
          </Button>
        </div>
      </div>
    </Modal>
  );
};
