import React from 'react';

export function LoadingSkeleton({ count = 6, type = 'card' }) {
  if (type === 'row') {
    return (
      <div className="space-y-3 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-full bg-slate-200/70 dark:bg-slate-800/60 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-44 w-full bg-slate-200/70 dark:bg-slate-800/60 rounded-2xl animate-pulse p-4 flex flex-col justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/3 mt-4" />
        </div>
      ))}
    </div>
  );
}

