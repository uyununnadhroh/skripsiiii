import { apiService } from './api.service';

export const authService = {
  // Login
  login: async (email, password) => {
    const data = await apiService.post('/auth/login', { email, password }, false);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Register
  register: async (userData) => {
    return apiService.post('/auth/register', userData, false);
  },
};
