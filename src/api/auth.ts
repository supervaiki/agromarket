import axios from 'axios';
import { LoginCredentials, AuthResponse, User } from '../types/types';

const API_BASE_URL = 'https://agroapi-qwvb.onrender.com/api/';

// Create axios instance with auth interceptor
const authApi = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 responses
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
            refresh: refreshToken,
          });
          
          const newToken = response.data.access;
          localStorage.setItem('auth_token', newToken);
          
          // Retry the original request
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return authApi.request(error.config);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, logout user
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}auth/login/`, credentials);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erreur de connexion. Veuillez vérifier vos identifiants.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await authApi.post('auth/logout/', { refresh: refreshToken });
    }
  } catch (error) {
    // Even if logout fails, we'll clear local storage
    console.error('Logout error:', error);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await authApi.get('auth/me/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to get current user');
  }
};

export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}auth/refresh/`, {
      refresh: refreshToken,
    });
    return response.data.access;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

// Demo functions for development (since we don't have a real auth backend yet)
export const demoLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Demo users
  const demoUsers: { [key: string]: User } = {
    'admin': {
      id: '1',
      username: 'admin',
      email: 'admin@agromarket.com',
      role: 'admin',
      firstName: 'Administrateur',
      lastName: 'AgroMarket',
      avatar: undefined,
      createdAt: '2023-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      isActive: true,
    },
    'agent': {
      id: '2',
      username: 'agent',
      email: 'agent@agromarket.com',
      role: 'agent',
      firstName: 'Agent',
      lastName: 'Marché',
      avatar: undefined,
      createdAt: '2023-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      isActive: true,
    },
  };

  // Simple demo authentication
  if (credentials.password === 'password' && demoUsers[credentials.username]) {
    return {
      user: demoUsers[credentials.username],
      token: `demo_token_${credentials.username}_${Date.now()}`,
      refreshToken: `demo_refresh_${credentials.username}_${Date.now()}`,
    };
  }

  throw new Error('Identifiants invalides. Utilisez admin/password ou agent/password');
};

export const demoGetCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('auth_token');
  if (!token || !token.startsWith('demo_token_')) {
    throw new Error('Invalid token');
  }

  // Extract username from demo token
  const username = token.split('_')[2];
  
  if (username === 'admin') {
    return {
      id: '1',
      username: 'admin',
      email: 'admin@agromarket.com',
      role: 'admin',
      firstName: 'Administrateur',
      lastName: 'AgroMarket',
      avatar: undefined,
      createdAt: '2023-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      isActive: true,
    };
  } else if (username === 'agent') {
    return {
      id: '2',
      username: 'agent',
      email: 'agent@agromarket.com',
      role: 'agent',
      firstName: 'Agent',
      lastName: 'Marché',
      avatar: undefined,
      createdAt: '2023-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      isActive: true,
    };
  }

  throw new Error('User not found');
};

// Export the API instance for other modules
export { authApi };