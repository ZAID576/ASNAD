import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token (critical when mobile Tracking Prevention blocks cookies)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('asnad_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // localStorage might be blocked in strict private browsing, withCredentials cookie serves as backup
  }
  return config;
});

// Interceptor to unwrap standard response envelope & catch 401
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorData = error.response?.data?.error || {
      message: error.message || 'Network error occurred',
      code: 'NETWORK_ERROR',
    };

    // If session expired on a protected request, redirect to login unless already there
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && window.location.pathname !== '/') {
      // Allow caller to handle or trigger logout state
    }

    return Promise.reject(errorData);
  }
);

export default api;
