import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface AcceptanceCriteria {
  id?: number;
  description: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  priority: string;
  estimate_hours: number;
  category_id: number;
  acceptance_criteria: AcceptanceCriteria[];
}

// Example data utilities
export const exampleData = {
  // Example user roles for the PRD
  roles: [
    {
      id: -1, // Use negative IDs for example data to avoid conflicts with backend
      name: "Administrator",
      description: "System administrator with access to all features and configuration options."
    },
    {
      id: -2,
      name: "Customer",
      description: "End-users who interact with the product's core functionality."
    },
    {
      id: -3,
      name: "Manager",
      description: "Oversees operations, accesses reports, and manages team members."
    }
  ],
  
  // Example categories for the PRD
  categories: [
    {
      id: -1,
      name: "Admin Panel",
      description: "Features related to system administration and configuration."
    },
    {
      id: -2,
      name: "User Management",
      description: "Features for managing user accounts, permissions, and profiles."
    },
    {
      id: -3,
      name: "Reporting",
      description: "Data visualization, analytics, and report generation capabilities."
    }
  ],
  
  // Example features for the PRD
  features: [
    {
      id: -1,
      title: "User Authentication",
      description: "Secure login system with multi-factor authentication capabilities.",
      priority: "high",
      estimate_hours: 24,
      category_id: -1, // Admin Panel
      acceptance_criteria: [
        { id: -1, description: "System must support username/password authentication" },
        { id: -2, description: "Users can reset their passwords via email" },
        { id: -3, description: "Account lockout after 5 failed attempts" }
      ]
    },
    {
      id: -2,
      title: "User Profile Management",
      description: "Interface for users to view and edit their profile information.",
      priority: "medium",
      estimate_hours: 16,
      category_id: -2, // User Management
      acceptance_criteria: [
        { id: -4, description: "Users can update personal information" },
        { id: -5, description: "Profile picture upload with cropping" },
        { id: -6, description: "Email verification workflow" }
      ]
    },
    {
      id: -3,
      title: "Analytics Dashboard",
      description: "Visual dashboard with key metrics and performance indicators.",
      priority: "medium",
      estimate_hours: 40,
      category_id: -3, // Reporting
      acceptance_criteria: [
        { id: -7, description: "Display daily/weekly/monthly user activity" },
        { id: -8, description: "Charts must be exportable as PNG/PDF" },
        { id: -9, description: "Dashboard should be customizable by users" }
      ]
    }
  ]
};

interface PRDState {
  // Current PRD ID
  currentPrdId: number | null;
  
  // PRD Data
  prd: {
    title: string;
    client_name: string;
    project_overview: string;
  };
  
  // Wizard Data
  roles: Role[];
  categories: Category[];
  features: Feature[];
  
  // Actions
  setPrdId: (id: number) => void;
  setPrd: (prd: any) => void;
  setRoles: (roles: Role[]) => void;
  setCategories: (categories: Category[]) => void;
  setFeatures: (features: Feature[]) => void;
  
  // Clear state
  clearState: () => void;
}

// Create the store with persistence
export const usePrdStore = create<PRDState>()(
  persist(
    (set) => ({
      // Initial state
      currentPrdId: null,
      prd: {
        title: '',
        client_name: '',
        project_overview: '',
      },
      roles: [],
      categories: [],
      features: [],
      
      // Actions
      setPrdId: (id) => set({ currentPrdId: id }),
      setPrd: (prd) => set({ prd }),
      setRoles: (roles) => set({ roles }),
      setCategories: (categories) => set({ categories }),
      setFeatures: (features) => set({ features }),
      
      // Clear state
      clearState: () => set({
        currentPrdId: null,
        prd: {
          title: '',
          client_name: '',
          project_overview: '',
        },
        roles: [],
        categories: [],
        features: [],
      }),
    }),
    {
      name: 'prd-store', // Local storage key
    }
  )
);