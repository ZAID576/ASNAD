import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Image,
  File,
  Film,
  Music,
} from 'lucide-react';

export const formatBytes = (bytes, decimals = 1) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getFileIcon = (mimeType = '') => {
  if (mimeType.includes('pdf')) {
    return { icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/40' };
  }
  if (mimeType.includes('image')) {
    return { icon: Image, color: 'text-brand-blue', bg: 'bg-blue-50 dark:bg-blue-950/40' };
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return { icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/40' };
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' };
  }
  if (mimeType.includes('video')) {
    return { icon: Film, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40' };
  }
  if (mimeType.includes('audio')) {
    return { icon: Music, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40' };
  }
  return { icon: File, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-surface-dark-border' };
};
