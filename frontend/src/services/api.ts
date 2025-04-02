import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

// Data endpoints
export const getThemes = async () => {
  const response = await api.get('/data/themes');
  return response.data;
};

export const getSubthemes = async (themeId: number) => {
  const response = await api.get(`/data/themes/${themeId}/subthemes`);
  return response.data;
};

export const getCategories = async (subthemeId: number) => {
  const response = await api.get(`/data/subthemes/${subthemeId}/categories`);
  return response.data;
};

export const getRandomName = async (categoryId: number) => {
  const response = await api.get(`/data/categories/${categoryId}/random-name`);
  return response.data;
};

export const getAllData = async () => {
  const response = await api.get('/data/all');
  return response.data;
};

export const importData = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/data/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const addTheme = async (name: string) => {
  const response = await api.post('/data/themes', { name });
  return response.data;
};

export const addSubtheme = async (themeId: number, name: string) => {
  const response = await api.post('/data/subthemes', { themeId, name });
  return response.data;
};

export const addCategory = async (subthemeId: number, name: string) => {
  const response = await api.post('/data/categories', { subthemeId, name });
  return response.data;
};

export const addName = async (name: string, categoryIds: number[]) => {
  const response = await api.post('/data/names', { name, categoryIds });
  return response.data;
};

export const deleteName = async (id: number) => {
  const response = await api.delete(`/data/names/${id}`);
  return response.data;
}; 