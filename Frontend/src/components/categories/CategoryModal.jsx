import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { categoryApi } from '../../api/categoryApi';
import { useToast } from '../../context/ToastContext';

const COLOR_PALETTE = [
  '#4285F4', // Google Blue
  '#EA4335', // Google Red
  '#FBBC05', // Google Yellow
  '#34A853', // Google Green
  '#00897B', // Teal
  '#7B1FA2', // Purple
  '#3949AB', // Indigo
  '#5C6BC0', // Lavender
  '#F4511E', // Deep Orange
  '#5F6368', // Slate / Neutral
];

export const CategoryModal = ({
  isOpen,
  onClose,
  category = null,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4285F4');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setColor(category.color || '#4285F4');
    } else {
      setName('');
      setColor('#4285F4');
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      if (category) {
        const res = await categoryApi.update(category.id, { name: name.trim(), color });
        if (res.success) {
          toast.success('Category updated successfully');
          onClose();
          if (onSuccess) onSuccess(res.data.category);
        }
      } else {
        const res = await categoryApi.create({ name: name.trim(), color });
        if (res.success) {
          toast.success('Category created successfully');
          onClose();
          if (onSuccess) onSuccess(res.data.category);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'New Category'}
      subtitle="Organize your documents with customized colored labels"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g. Invoices, Passports, Tax Returns"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
            Select Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110' : 'hover:scale-105'
                }`}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-surface-dark-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={loading}
          >
            {category ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
