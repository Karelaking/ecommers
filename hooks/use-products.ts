import { create } from 'zustand';
import { Product, Category, ProductFilters, SortOption } from '@/types/database';

interface ProductState {
  products: Product[];
  categories: Category[];
  currentProduct?: Product;
  filters: ProductFilters;
  searchQuery: string;
  sort: SortOption;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error?: string;

  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setCurrentProduct: (product?: Product) => void;
  setFilters: (filters: ProductFilters) => void;
  updateFilter: (key: keyof ProductFilters, value: any) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSort: (sort: SortOption) => void;
  setPagination: (pagination: Partial<ProductState['pagination']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

const initialState = {
  products: [],
  categories: [],
  currentProduct: undefined,
  filters: {},
  searchQuery: '',
  sort: 'newest' as SortOption,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: undefined,
};

export const useProductStore = create<ProductState>((set, get) => ({
  ...initialState,

  setProducts: (products) => set({ products }),

  setCategories: (categories) => set({ categories }),

  setCurrentProduct: (product) => set({ currentProduct: product }),

  setFilters: (filters) => set({ filters, pagination: { ...get().pagination, page: 1 } }),

  updateFilter: (key, value) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, [key]: value };
    
    // Remove filter if value is empty or null
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    }
    
    get().setFilters(newFilters);
  },

  clearFilters: () => set({ 
    filters: {}, 
    pagination: { ...get().pagination, page: 1 } 
  }),

  setSearchQuery: (query) => set({ 
    searchQuery: query, 
    pagination: { ...get().pagination, page: 1 } 
  }),

  setSort: (sort) => set({ sort, pagination: { ...get().pagination, page: 1 } }),

  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));