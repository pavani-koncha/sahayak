import axios from 'axios';
import type {
  User,
  EmergencyContact,
  EmergencyAlert,
  LocationRecord,
  NearbyResponse
} from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sahayak_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized, except on login/register endpoints
      const isAuthEndpoint = error.config.url?.includes('/api/auth/login') || error.config.url?.includes('/api/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('sahayak_token');
        localStorage.removeItem('sahayak_user');
        // Let the state catch up or redirect if not already on login
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: { name: string; email: string; phone: string; password: string }) => {
    const res = await api.post<{ access_token: string; token_type: string; user: User }>('/api/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{ access_token: string; token_type: string; user: User }>('/api/auth/login', data);
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('sahayak_token');
      localStorage.removeItem('sahayak_user');
    }
  },
  getMe: async () => {
    const res = await api.get<User>('/api/auth/me');
    return res.data;
  }
};

export const profileApi = {
  getProfile: async () => {
    const res = await api.get<User>('/api/profile');
    return res.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const res = await api.put<User>('/api/profile', data);
    return res.data;
  }
};

export const contactsApi = {
  getContacts: async () => {
    const res = await api.get<EmergencyContact[]>('/api/contacts');
    return res.data;
  },
  createContact: async (data: { name: string; phone: string; relationship: string; is_primary: boolean }) => {
    const res = await api.post<EmergencyContact>('/api/contacts', data);
    return res.data;
  },
  updateContact: async (id: number, data: Partial<EmergencyContact>) => {
    const res = await api.put<EmergencyContact>(`/api/contacts/${id}`, data);
    return res.data;
  },
  deleteContact: async (id: number) => {
    const res = await api.delete(`/api/contacts/${id}`);
    return res.data;
  }
};

export const emergencyApi = {
  activate: async (data: { alert_type: string; latitude: number; longitude: number; accuracy?: number | null }) => {
    const res = await api.post<EmergencyAlert>('/api/emergency/activate', data);
    return res.data;
  },
  getActive: async () => {
    const res = await api.get<EmergencyAlert | null>('/api/emergency/active');
    return res.data;
  },
  cancel: async (id: number) => {
    const res = await api.post<EmergencyAlert>(`/api/emergency/${id}/cancel`);
    return res.data;
  },
  resolve: async (id: number) => {
    const res = await api.post<EmergencyAlert>(`/api/emergency/${id}/resolve`);
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get<EmergencyAlert[]>('/api/emergency/history');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await api.get<EmergencyAlert>(`/api/emergency/${id}`);
    return res.data;
  }
};

export const locationApi = {
  saveLocation: async (data: { latitude: number; longitude: number; accuracy?: number | null }) => {
    const res = await api.post<LocationRecord>('/api/location', data);
    return res.data;
  },
  getLatest: async () => {
    const res = await api.get<LocationRecord | null>('/api/location/latest');
    return res.data;
  }
};

export const nearbyApi = {
  getNearby: async (lat: number, lng: number, category: string = 'hospitals', radius: number = 15000) => {
    const res = await api.get<NearbyResponse>('/api/nearby', {
      params: { lat, lng, category, radius }
    });
    return res.data;
  }
};

export const healthApi = {
  checkHealth: async () => {
    const res = await api.get('/api/health');
    return res.data;
  }
};

export default api;
