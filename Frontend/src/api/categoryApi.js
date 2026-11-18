import api from './client';

export const categoryApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCat: (id, reassignToCategoryId) =>
    api.delete(`/categories/${id}`, { data: { reassignToCategoryId } }),
};
