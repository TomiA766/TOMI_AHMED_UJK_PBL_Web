import axios from 'axios';

const skipLogin = import.meta.env.VITE_SKIP_LOGIN === 'true';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(
  res => res,
  err => {
    const isLoginRequest = err.config?.url?.includes('/auth/login');
    if (!skipLogin && !isLoginRequest && err.response?.status === 401) {
      window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);
export default api;
