import axios from 'axios';

// The single HTTP client for the whole app (RULES R13). Never hardcode a host elsewhere.
const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 the token is missing/expired: clear the session and send the user to /login.
// Login/signup requests also return 401 for bad credentials - let those reach their own handler.
client.interceptors.response.use(
  (r) => r,
  (error) => {
    const url = error.config?.url || '';
    const isAuthCall = url.startsWith('/api/auth/');
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default client;
