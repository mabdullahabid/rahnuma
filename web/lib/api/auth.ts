// API client setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail || `API error: ${response.status}`);
  }
  return response.json();
};

// Authentication service
export const authService = {
  // Login with username and password
  login: (username: string, password: string) => {
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(handleResponse)
      .then(data => {
        // Store the token in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
      });
  },

  // Register a new user
  register: (userData: { username: string; email: string; password: string; first_name?: string; last_name?: string }) => {
    return fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then(handleResponse);
  },

  // Logout the current user
  logout: () => {
    // Remove token and user from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isAuthenticated: () => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('auth_token') !== null;
  },

  // Get current user details
  getCurrentUser: () => {
    if (typeof window === 'undefined') {
      return null;
    }
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};