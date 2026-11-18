import apiClient from './client';

export const documentsApi = {
  list: (params) => apiClient.get('/documents', { params }),
  upload: (formData) =>
    apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getById: (id) => apiClient.get(`/documents/${id}`),
  update: (id, data) => apiClient.patch(`/documents/${id}`, data),
  trash: (id) => apiClient.post(`/documents/${id}/trash`),
  restore: (id) => apiClient.post(`/documents/${id}/restore`),
  permanentDelete: (id, deleteDriveFile = false) =>
    apiClient.delete(`/documents/${id}/permanent?deleteDriveFile=${deleteDriveFile}`),
  toggleFavorite: (id) => apiClient.post(`/documents/${id}/favorite`),
  getDownloadUrl: (id) => `/api/v1/documents/${id}/download`,
  getViewUrl: (id) => `/api/v1/documents/${id}/view`,
};

