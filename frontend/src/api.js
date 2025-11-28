import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Funciones de Autenticación
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Funciones de Perfil de Contratista
export const getContractorProfile = () => api.get('/contractor/profile');
export const updateContractorProfile = (profileData) => api.put('/contractor/profile', profileData);

// Funciones Públicas
export const getAllCategories = () => api.get('/categories');
export const getPublicContractors = (params) => api.get('/public/contractors', { params });

// Funciones de Reseñas y Solicitudes
export const createReview = (reviewData) => api.post('/reviews', reviewData);
export const createServiceRequest = (requestData) => api.post('/requests', requestData);


export default api; 