import apiClient from './client';

export const categoriesApi = {
  list: () => apiClient.get('/categories'),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.patch(`/categories/${id}`, data),
  delete: (id, reassignToId) =>
    apiClient.delete(`/categories/${id}`, { data: { reassignToId } }),
};

