import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email, password) {
    try {
      // Mock Firebase authentication
      const mockIdToken = `mock_firebase_token_${email}`;
      
      const response = await api.post('/api/auth/login', {
        id_token: mockIdToken
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  async signup(userData) {
    try {
      // Mock Firebase authentication
      const mockFirebaseUid = `firebase_uid_${Date.now()}`;
      
      const response = await api.post('/api/auth/register', {
        ...userData,
        firebase_uid: mockFirebaseUid
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Signup failed');
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get user data');
    }
  },

  async updateUser(userData) {
    try {
      const response = await api.put('/api/auth/me', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update user');
    }
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};
