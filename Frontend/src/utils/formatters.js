export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getFileCategory(mimeType = '', fileName = '') {
  const ext = fileName.split('.').pop().toLowerCase();

  if (mimeType.includes('pdf') || ext === 'pdf') {
    return { type: 'pdf', color: 'text-red-500 bg-red-500/10 border-red-500/20', label: 'PDF' };
  }
  if (mimeType.includes('image') || ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext)) {
    return { type: 'image', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Image' };
  }
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    ['xlsx', 'xls', 'csv'].includes(ext)
  ) {
    return { type: 'sheet', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', label: 'Sheet' };
  }
  if (
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    ['pptx', 'ppt'].includes(ext)
  ) {
    return { type: 'slide', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', label: 'Slides' };
  }
  if (
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    ['docx', 'doc', 'rtf'].includes(ext)
  ) {
    return { type: 'doc', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', label: 'Document' };
  }
  if (mimeType.includes('text') || ext === 'txt') {
    return { type: 'text', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', label: 'Text' };
  }

  return { type: 'file', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', label: 'File' };
}

