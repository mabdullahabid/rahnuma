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