// ============================================================================
// API.JS - Cliente de API para o frontend
// ============================================================================
// Este arquivo centraliza todas as chamadas à API do backend,
// facilitando a manutenção e reutilização do código.
// ============================================================================

import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

// ============================================================================
// CONFIGURAÇÃO DO AXIOS
// ============================================================================

// Cria uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// SERVIÇOS - FUNÇÕES DE CHAMADA À API
// ============================================================================

/**
 * SERVIÇOS - Gerenciamento de serviços comunitários
 */
export const servicesAPI = {
  // Lista todos os serviços ativos
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  // Obtém detalhes de um serviço específico
  getById: async (serviceId) => {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  },

  // Lista serviços do organizador logado
  getMyServices: async () => {
    const response = await api.get('/services/organizer/my-services');
    return response.data;
  },

  // Cria um novo serviço (apenas organizadores)
  create: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Atualiza um serviço existente
  update: async (serviceId, updates) => {
    const response = await api.put(`/services/${serviceId}`, updates);
    return response.data;
  },

  // Deleta (desativa) um serviço
  delete: async (serviceId) => {
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  },
};

/**
 * AGENDAMENTOS - Gerenciamento de agendamentos
 */
export const bookingsAPI = {
  // Cria um novo agendamento
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Lista agendamentos do usuário logado
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Lista agendamentos dos serviços do organizador
  getOrganizerBookings: async () => {
    const response = await api.get('/bookings/organizer/all');
    return response.data;
  },

  // Atualiza um agendamento (status, rating, etc)
  update: async (bookingId, updates) => {
    const response = await api.put(`/bookings/${bookingId}`, updates);
    return response.data;
  },

  // Cancela um agendamento
  cancel: async (bookingId) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },
};

/**
 * USUÁRIOS - Gerenciamento de perfil
 */
export const usersAPI = {
  // Obtém informações do usuário logado
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Atualiza perfil do usuário logado
  updateProfile: async (updates) => {
    const response = await api.put('/users/me', updates);
    return response.data;
  },
};

export default api;
