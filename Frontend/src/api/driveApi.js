import api from './client';

export const driveApi = {
  getStatus: () => api.get('/google-drive/status'),
  connect: () => api.post('/google-drive/connect'),
  getToken: () => api.get('/google-drive/token'),
  disconnect: () => api.post('/google-drive/disconnect'),
};
