import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Files,
  ExternalLink,
} from 'lucide-react';
import { categoryApi } from '../api/categoryApi';
import { Button } from '../components/common/Button';
import { CategoryModal } from '../components/categories/CategoryModal';
import { DeleteCategoryModal } from '../components/categories/DeleteCategoryModal';
import { EmptyState } from '../components/common/EmptyState';
import { getCache, setCache } from '../utils/cache';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState(() => getCache('asnad_categories', []));

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async (silent = false) => {
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

  useEffect(() => {
    fetchCategories(true);
  }, []);

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            Categories
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-dark-border text-gray-600 dark:text-gray-300">
              {categories.length}
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
            Organize documents logically into custom labeled color folders.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="text-xs py-1.5 px-3 self-start sm:self-auto"
        >
          Create Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No categories created yet"
          description="Create categories like Identity, Education, Banking, or Medical to organize your documents."
          actionLabel="Create First Category"
          onAction={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group p-3.5 sm:p-4 bg-white dark:bg-surface-dark-card border border-gray-200/90 dark:border-surface-dark-border rounded-xl sm:rounded-2xl hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2.5 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center justify-center flex-shrink-0 text-black dark:text-white">
                    <FolderTree className="w-5 h-5 text-black dark:text-white" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <Files className="w-3 h-3 text-gray-400" />
                      {cat.documentCount} {cat.documentCount === 1 ? 'document' : 'documents'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setModalOpen(true);
                    }}
                    title="Edit category"
                    className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-dark-border rounded-md transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    title="Delete category"
                    className="p-1 text-gray-400 hover:text-brand-red hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="pt-2 sm:pt-2.5 border-t border-gray-100 dark:border-surface-dark-border/60 flex items-center justify-between text-xs">
                <span
                  className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium"
                  style={{ color: cat.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  Theme
                </span>

                <Link
                  to={`/documents?category=${cat.id}`}
                  className="text-[11px] sm:text-xs font-semibold text-brand-blue hover:underline flex items-center gap-1"
                >
                  View Files <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Create/Edit Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={() => fetchCategories()}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        category={deleteTarget}
        otherCategories={categories}
        onSuccess={() => fetchCategories()}
      />
    </div>
  );
};
