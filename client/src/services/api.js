import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    // In development mode, if front-end is on port 5173 and backend is on 5005
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5005/api';
    }
    // In production, if served together, we can use relative URL.
    return '/api';
  }
  return 'http://localhost:5005/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication Endpoints
export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (userData) => API.post('/auth/register', userData);
export const getProfile = () => API.get('/auth/profile');
export const saveProfile = (profileData) => API.post('/auth/profiles', profileData);
export const deleteProfile = (id) => API.delete(`/auth/profiles/${id}`);

// Astrology & Gemstone Endpoints
export const recommendGemstone = (birthData) => API.post('/astrology/recommend', birthData);
export const getHistory = () => API.get('/astrology/history');
export const getReport = (id) => API.get(`/astrology/report/${id}`);
export const getGemstones = () => API.get('/gemstones');
export const getGemstoneDetails = (name) => API.get(`/gemstones/${name}`);

export default API;
