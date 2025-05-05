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

// Get authentication token from local storage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Base fetch function with authentication
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  }).then(handleResponse);
};

// API service for PRD module
export const prdService = {
  // Get all PRDs
  getAllPRDs: () => {
    return fetchWithAuth('/prd/');
  },

  // Get a single PRD by ID
  getPRD: (id: number) => {
    return fetchWithAuth(`/prd/${id}`);
  },

  // Create a new PRD
  createPRD: (data: { title: string; client_name: string; project_overview: string }) => {
    return fetchWithAuth('/prd/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing PRD
  updatePRD: (id: number, data: { title?: string; client_name?: string; project_overview?: string }) => {
    return fetchWithAuth(`/prd/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a PRD
  deletePRD: (id: number) => {
    return fetchWithAuth(`/prd/${id}`, {
      method: 'DELETE',
    });
  },

  // Add a user role to a PRD
  addRole: (prdId: number, data: { name: string; description: string }) => {
    return fetchWithAuth(`/prd/${prdId}/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all roles for a PRD
  getRoles: (prdId: number) => {
    return fetchWithAuth(`/prd/${prdId}/roles`);
  },

  // Add a category to a PRD
  addCategory: (prdId: number, data: { name: string; description: string }) => {
    return fetchWithAuth(`/prd/${prdId}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all categories for a PRD
  getCategories: (prdId: number) => {
    return fetchWithAuth(`/prd/${prdId}/categories`);
  },

  // Add a feature to a category
  addFeature: (prdId: number, categoryId: number, data: {
    title: string;
    description: string;
    priority: string;
    estimate_hours: number;
    acceptance_criteria: { description: string }[];
  }) => {
    return fetchWithAuth(`/prd/${prdId}/categories/${categoryId}/features`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Add a project reference to a PRD
  addReference: (prdId: number, data: { name: string; content_type: string; content: string }) => {
    return fetchWithAuth(`/prd/${prdId}/references`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all references for a PRD
  getReferences: (prdId: number) => {
    return fetchWithAuth(`/prd/${prdId}/references`);
  },
};