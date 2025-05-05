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
  // === PRD Resource ===
  // Get all PRDs (list)
  getAllPRDs: async () => {
    return fetchWithAuth('/prd') as Promise<{items: any[], count: number}>;
  },

  // Get a single PRD by ID
  getPRD: async (id: number | string) => {
    return fetchWithAuth(`/prd/${id}`);
  },

  // Create a new PRD
  createPRD: async (data: { title: string; client_name?: string; overview?: string }) => {
    return fetchWithAuth('/prd', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(data => data.id);
  },

  // Update an existing PRD
  updatePRD: (id: number | string, data: { title?: string; client_name?: string; project_overview?: string }) => {
    return fetchWithAuth(`/prd/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a PRD
  deletePRD: (id: number | string) => {
    return fetchWithAuth(`/prd/${id}`, {
      method: 'DELETE',
    });
  },

  // === Role Resource ===
  // Get all roles for a PRD
  getRoles: (prdId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/roles`);
  },

  // Add a user role to a PRD
  addRole: (prdId: number | string, data: { name: string; description: string }) => {
    return fetchWithAuth(`/prd/${prdId}/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update an existing role
  updateRole: (prdId: number | string, roleId: number | string, data: { name: string; description: string }) => {
    return fetchWithAuth(`/prd/${prdId}/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a role
  deleteRole: (prdId: number | string, roleId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/roles/${roleId}`, {
      method: 'DELETE',
    });
  },

  // === Category Resource ===
  // Get all categories for a PRD
  getCategories: (prdId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/categories`);
  },

  // Add a category to a PRD
  addCategory: (prdId: number | string, data: { name: string; description: string }) => {
    return fetchWithAuth(`/prd/${prdId}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update a category
  updateCategory: (prdId: number | string, categoryId: number | string, data: { name: string; description: string }) => {
    return fetchWithAuth(`/prd/${prdId}/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a category
  deleteCategory: (prdId: number | string, categoryId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },

  // === Feature Resource ===
  // Get features for a category
  getFeatures: (prdId: number | string, categoryId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/categories/${categoryId}/features`);
  },

  // Add a feature to a category
  addFeature: (prdId: number | string, categoryId: number | string, data: {
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

  // Update a feature
  updateFeature: (prdId: number | string, categoryId: number | string, featureId: number | string, data: {
    title: string;
    description: string;
    priority: string;
    estimate_hours: number;
    acceptance_criteria: { description: string }[];
  }) => {
    return fetchWithAuth(`/prd/${prdId}/categories/${categoryId}/features/${featureId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete a feature
  deleteFeature: (prdId: number | string, categoryId: number | string, featureId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/categories/${categoryId}/features/${featureId}`, {
      method: 'DELETE',
    });
  },

  // === Reference Resource ===
  // Get all references for a PRD
  getReferences: (prdId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/references`);
  },

  // Add a project reference to a PRD
  addReference: (prdId: number | string, data: { name: string; content_type: string; content: string }) => {
    return fetchWithAuth(`/prd/${prdId}/references`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Delete a reference
  deleteReference: (prdId: number | string, referenceId: number | string) => {
    return fetchWithAuth(`/prd/${prdId}/references/${referenceId}`, {
      method: 'DELETE',
    });
  },

  // Upload reference files
  uploadReferenceFiles: async (prdId: number | string, files: File[]) => {
    const formData = new FormData();
    
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
  addReferenceUrls: async (prdId: number | string, urls: string[]) => {
    return fetchWithAuth(`/prd/${prdId}/add-reference-urls`, {
      method: 'POST',
      body: JSON.stringify({ urls }),
    });
  },
};