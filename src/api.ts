import axios from 'axios';

const api = axios.create({
  // Permanent production backend URL
  baseURL: 'https://cc-backend-production-00fe.up.railway.app/', 
});

// Add request interceptor to attach JWT/Token
api.interceptors.request.use((config) => {
  // Check for both token naming conventions used in your app
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auto-redirect if user is deleted/unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      // Clear all stored user state & orders
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('orders');
      
      // Dispatch custom event to notify AuthContext to update React state
      window.dispatchEvent(new Event('user_session_expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
