import api from './client';

export const documentApi = {
  list: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  initiateUpload: (data) => api.post('/documents/initiate-upload', data),
  completeUpload: (data) => api.post('/documents/complete-upload', data),
  upload: (formData, onProgress) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }),
  importFromDrive: (data) => api.post('/documents/import', data),
  update: (id, data) => api.patch(`/documents/${id}`, data),
  toggleFavorite: (id) => api.post(`/documents/${id}/favorite`),
  deleteDoc: (id) => api.delete(`/documents/${id}`),
  getDownloadUrl: (id) => `/api/v1/documents/${id}/download`,
  getViewUrl: (id) => `/api/v1/documents/${id}/view`,
};
