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
  // Login with username or email and password
  login: (usernameOrEmail: string, password: string) => {
    // Determine if the input is an email or username
    const isEmail = usernameOrEmail.includes('@');
    
    // Construct the payload based on whether it's an email or username
    const payload = isEmail 
      ? { email: usernameOrEmail, password } 
      : { username: usernameOrEmail, password };
    
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(handleResponse)
      .then(data => {
        // Store the token in localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          
          // Since we don't get user info in the response, 
          // store a minimal user object based on login info
          const user = {
            username: isEmail ? '' : usernameOrEmail,
            email: isEmail ? usernameOrEmail : '',
          };
          localStorage.setItem('user', JSON.stringify(user));
        }
        return data;
      });
  },

  // Register a new user
  register: (userData: { username: string; email: string; password: string; first_name?: string; last_name?: string }) => {
    return fetch(`${API_BASE_URL}/auth/signup`, {
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