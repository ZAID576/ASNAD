import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full rounded-lg border bg-white dark:bg-surface-dark-card text-gray-900 dark:text-gray-100 text-sm transition-colors
              ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5
              ${
                error
                  ? 'border-brand-red focus:border-brand-red focus:ring-1 focus:ring-brand-red'
                  : 'border-gray-300 dark:border-surface-dark-border focus:border-brand-blue focus:ring-1 focus:ring-brand-blue'
              }
              focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50 disabled:bg-gray-50 ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-brand-red font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
