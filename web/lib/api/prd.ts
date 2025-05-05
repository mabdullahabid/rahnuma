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
  getAllPRDs: async () => {
    return fetchWithAuth('/prd/') as Promise<{items: any[], count: number}>;
  },

  // Get a single PRD by ID
  getPRD: async (id: string) => {
    return fetchWithAuth(`/prd/${id}`);
  },

  // Create a new PRD
  createPRD: async (data: { title: string; client_name?: string; overview?: string }) => {
    return fetchWithAuth('/prd/', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(data => data.id);
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

  // Upload reference files
  uploadReferenceFiles: async (prdId: string, files: File[]) => {
    const formData = new FormData();
    
    // Add the PRD ID
    formData.append('prd_id', prdId);
    
    // Add each file to the form data
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // We need to use a custom fetch here since fetchWithAuth sets Content-Type to application/json
    const token = getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetch(`${API_BASE_URL}/prd/${prdId}/upload-references`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(handleResponse);
  },

  // Add reference URLs
  addReferenceUrls: async (prdId: string, urls: string[]) => {
    return fetchWithAuth(`/prd/${prdId}/add-reference-urls`, {
      method: 'POST',
      body: JSON.stringify({ urls }),
    });
  },
};