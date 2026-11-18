import apiClient from './client';

export const trashApi = {
  list: () => apiClient.get('/trash'),
  restore: (id) => apiClient.post(`/trash/${id}/restore`),
  permanentDelete: (id, deleteDriveFile = false) =>
    apiClient.delete(`/trash/${id}/permanent?deleteDriveOriginal=${deleteDriveFile}`),
};

export default trashApi;

