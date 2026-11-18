import apiClient from './client';

export const driveApi = {
  getStatus: () => apiClient.get('/google-drive/status'),
  getConnectUrl: () => apiClient.get('/google-drive/connect'),
  getPickerConfig: () => apiClient.get('/google-drive/picker-config'),
  importPickerDoc: (data) => apiClient.post('/google-drive/import', data),
  disconnect: () => apiClient.post('/google-drive/disconnect'),
};

