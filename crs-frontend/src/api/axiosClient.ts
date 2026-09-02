import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const DEFAULT_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6MSwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3ODgzMTg2MzMsImV4cCI6MTc5MDkxMDYzM30.OHfaJkZ0jvcTUqhXUIYhYRHOwT_G8yaOGLNioS8MScs';

axiosClient.interceptors.request.use((config) => {
  let token = localStorage.getItem('crs_token');
  if (!token) {
    token = DEFAULT_ADMIN_TOKEN;
    localStorage.setItem('crs_token', token);
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
