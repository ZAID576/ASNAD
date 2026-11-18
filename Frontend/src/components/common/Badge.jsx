import React from 'react';

export const Badge = ({
  children,
  color,
  variant = 'soft',
  size = 'sm',
  className = '',
}) => {
  const customStyle = color
    ? {
        backgroundColor: `${color}15`,
        color: color,
        borderColor: `${color}30`,
      }
    : {};

  const sizeClasses = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      style={customStyle}
      className={`inline-flex items-center gap-1 font-medium rounded-md border border-transparent transition-colors ${sizeClasses} ${
        !color
          ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          : ''
      } ${className}`}
    >
      {children}
    </span>
  );
};
