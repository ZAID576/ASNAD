import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-md' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-surface-dark-border ${rounded} ${className}`}
    />
  );
};

export const DocumentCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-surface-dark-card border border-gray-200 dark:border-surface-dark-border rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-2.5 sm:p-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between mt-1">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
};

export const DocumentTableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3.5 bg-white dark:bg-surface-dark-card rounded-xl border border-gray-100 dark:border-surface-dark-border"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-5 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
