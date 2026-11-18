import React from 'react';
import { Button } from './Button';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No documents found',
  description = 'You have not uploaded or linked any documents in this section yet.',
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-surface-dark-card border border-dashed border-gray-200 dark:border-surface-dark-border rounded-lg my-4">
      <div className="flex items-center justify-center mb-3 text-black dark:text-white">
        <Icon className="w-10 h-10 text-black dark:text-white" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
