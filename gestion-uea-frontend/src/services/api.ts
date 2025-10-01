// src/services/api.ts
import axios from 'axios';

// Configuration de base Axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ====== AUTHENTIFICATION ======
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/login', credentials),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
  createUser: (userData: any) => api.post('/create-user', userData),
};

// ====== UTILISATEURS ======
export const usersAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (userData: any) => api.post('/users', userData),
  update: (id: number, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: number) => api.delete(`/users/${id}`),
  getEnseignants: () => api.get('/enseignants'),
};

// ====== FILIÈRES ======
export const filieresAPI = {
  getAll: () => api.get('/filieres'),
  getById: (id: number) => api.get(`/filieres/${id}`),
  create: (data: any) => api.post('/filieres', data),
  update: (id: number, data: any) => api.put(`/filieres/${id}`, data),
  delete: (id: number) => api.delete(`/filieres/${id}`),
};

// ====== UEAs ======
export const ueasAPI = {
  getAll: (params?: any) => api.get('/ueas', { params }),
  getById: (id: number) => api.get(`/ueas/${id}`),
  create: (data: any) => api.post('/ueas', data),
  update: (id: number, data: any) => api.put(`/ueas/${id}`, data),
  delete: (id: number) => api.delete(`/ueas/${id}`),
  getStatistiques: (id: number) => api.get(`/ueas/${id}/statistiques`),
};

// ====== SALLES ======
export const sallesAPI = {
  getAll: () => api.get('/salles'),
  getById: (id: number) => api.get(`/salles/${id}`),
  create: (data: any) => api.post('/salles', data),
  update: (id: number, data: any) => api.put(`/salles/${id}`, data),
  delete: (id: number) => api.delete(`/salles/${id}`),
  verifierDisponibilite: (id: number, params: any) => 
    api.get(`/salles/${id}/disponibilite`, { params }),
};

// ====== SÉANCES ======
export const seancesAPI = {
  getAll: (params?: any) => api.get('/seances', { params }),
  getById: (id: number) => api.get(`/seances/${id}`),
  create: (data: any) => api.post('/seances', data),
  update: (id: number, data: any) => api.put(`/seances/${id}`, data),
  delete: (id: number) => api.delete(`/seances/${id}`),
  realiser: (id: number, data: any) => api.put(`/seances/${id}/realiser`, data),
  getPlanningHebdomadaire: (params?: any) => 
    api.get('/seances/planning/hebdomadaire', { params }),
};

// ====== DASHBOARD ======
export const dashboardAPI = {
  getStatistiques: () => api.get('/dashboard/statistiques'),
  getCalendrier: (params?: any) => api.get('/dashboard/calendrier', { params }),
};

export default api;