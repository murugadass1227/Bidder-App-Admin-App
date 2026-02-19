import { create } from 'zustand';
import { Lot, LotStatus, PaginatedResponse } from '@/types';

interface LotState {
  lots: Lot[];
  currentLot: Lot | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: LotStatus[];
    search?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };

  fetchLots: (page?: number, filters?: any) => Promise<void>;
  fetchLot: (id: string) => Promise<void>;
  createLot: (lot: Partial<Lot>) => Promise<Lot>;
  updateLot: (id: string, lot: Partial<Lot>) => Promise<Lot>;
  deleteLot: (id: string) => Promise<void>;
  updateLotStatus: (id: string, status: LotStatus) => Promise<void>;
  uploadFiles: (lotId: string, files: File[], type: 'images' | 'videos' | 'documents') => Promise<void>;
  setFilters: (filters: any) => void;
  clearCurrentLot: () => void;
}

export const useLotStore = create<LotState>((set, get) => ({
  lots: [],
  currentLot: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},

  fetchLots: async (page = 1, filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: get().pagination.limit.toString(),
        ...(filters?.status && { status: filters.status.join(',') }),
        ...(filters?.search && { search: filters.search }),
      });

      const response = await fetch(`/api/lots?${params}`);
      if (!response.ok) throw new Error('Failed to fetch lots');

      const data: PaginatedResponse<Lot> = await response.json();
      set({
        lots: data.data,
        pagination: {
          page: data.page,
          limit: data.limit,
          total: data.total,
          totalPages: data.totalPages,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch lots',
        isLoading: false 
      });
    }
  },

  fetchLot: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/lots/${id}`);
      if (!response.ok) throw new Error('Failed to fetch lot');

      const lot: Lot = await response.json();
      set({ currentLot: lot, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch lot',
        isLoading: false 
      });
    }
  },

  createLot: async (lotData: Partial<Lot>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/lots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lotData),
      });

      if (!response.ok) throw new Error('Failed to create lot');

      const lot: Lot = await response.json();
      set(state => ({
        lots: [lot, ...state.lots],
        isLoading: false,
      }));
      return lot;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create lot',
        isLoading: false 
      });
      throw error;
    }
  },

  updateLot: async (id: string, lotData: Partial<Lot>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/lots/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lotData),
      });

      if (!response.ok) throw new Error('Failed to update lot');

      const lot: Lot = await response.json();
      set(state => ({
        lots: state.lots.map(l => l.id === id ? lot : l),
        currentLot: state.currentLot?.id === id ? lot : state.currentLot,
        isLoading: false,
      }));
      return lot;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update lot',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteLot: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/lots/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete lot');

      set(state => ({
        lots: state.lots.filter(l => l.id !== id),
        currentLot: state.currentLot?.id === id ? null : state.currentLot,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete lot',
        isLoading: false 
      });
      throw error;
    }
  },

  updateLotStatus: async (id: string, status: LotStatus) => {
    await get().updateLot(id, { status });
  },

  uploadFiles: async (lotId: string, files: File[], type: 'images' | 'videos' | 'documents') => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);

    try {
      const response = await fetch(`/api/lots/${lotId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload files');

      // Refresh lot data to include new files
      await get().fetchLot(lotId);
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload files'
      });
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchLots(1, filters);
  },

  clearCurrentLot: () => {
    set({ currentLot: null });
  },
}));
