import api from './client';

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
  getRecent: () => api.get('/dashboard/recent'),
};

export const trashApi = {
  list: () => api.get('/trash'),
  restore: (id) => api.post(`/trash/${id}/restore`),
  permanentDelete: (id, deleteDriveOriginal = false) =>
    api.delete(`/trash/${id}/permanent?deleteDriveOriginal=${deleteDriveOriginal}`),
};
