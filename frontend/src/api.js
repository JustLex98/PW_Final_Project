// Archivo: src/api.js

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor para añadir automáticamente el token a todas las peticiones
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Funciones de Autenticación ---
export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const register = (userData) => apiClient.post('/auth/register', userData);

// --- Funciones de Perfil de Contratista ---
export const getContractorProfile = () => apiClient.get('/contractor/profile');
export const updateContractorProfile = (profileData) => apiClient.put('/contractor/profile', profileData);

// --- Funciones Públicas ---
export const getAllCategories = () => apiClient.get('/categories');
export const getPublicContractors = () => apiClient.get('/public/contractors');

export default apiClient;