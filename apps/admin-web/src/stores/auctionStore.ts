import { create } from 'zustand';
import { Auction, AuctionStatus, Bid, PaginatedResponse } from '@/types';

interface AuctionState {
  auctions: Auction[];
  currentAuction: Auction | null;
  bids: Bid[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: AuctionStatus[];
    search?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
  };

  fetchAuctions: (page?: number, filters?: any) => Promise<void>;
  fetchAuction: (id: string) => Promise<void>;
  createAuction: (auction: Partial<Auction>) => Promise<Auction>;
  updateAuction: (id: string, auction: Partial<Auction>) => Promise<Auction>;
  deleteAuction: (id: string) => Promise<void>;
  updateAuctionStatus: (id: string, status: AuctionStatus) => Promise<void>;
  fetchBids: (auctionId: string) => Promise<void>;
  removeBid: (bidId: string, reason: string) => Promise<void>;
  extendAuction: (id: string, endTime: Date) => Promise<void>;
  pauseAuction: (id: string) => Promise<void>;
  resumeAuction: (id: string) => Promise<void>;
  cancelAuction: (id: string, reason: string) => Promise<void>;
  setFilters: (filters: any) => void;
  clearCurrentAuction: () => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
  auctions: [],
  currentAuction: null,
  bids: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},

  fetchAuctions: async (page = 1, filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: get().pagination.limit.toString(),
        ...(filters?.status && { status: filters.status.join(',') }),
        ...(filters?.search && { search: filters.search }),
      });

      const response = await fetch(`/api/auctions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch auctions');

      const data: PaginatedResponse<Auction> = await response.json();
      set({
        auctions: data.data,
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
        error: error instanceof Error ? error.message : 'Failed to fetch auctions',
        isLoading: false 
      });
    }
  },

  fetchAuction: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/auctions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch auction');

      const auction: Auction = await response.json();
      set({ currentAuction: auction, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch auction',
        isLoading: false 
      });
    }
  },

  createAuction: async (auctionData: Partial<Auction>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auctionData),
      });

      if (!response.ok) throw new Error('Failed to create auction');

      const auction: Auction = await response.json();
      set(state => ({
        auctions: [auction, ...state.auctions],
        isLoading: false,
      }));
      return auction;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create auction',
        isLoading: false 
      });
      throw error;
    }
  },

  updateAuction: async (id: string, auctionData: Partial<Auction>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/auctions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auctionData),
      });

      if (!response.ok) throw new Error('Failed to update auction');

      const auction: Auction = await response.json();
      set(state => ({
        auctions: state.auctions.map(a => a.id === id ? auction : a),
        currentAuction: state.currentAuction?.id === id ? auction : state.currentAuction,
        isLoading: false,
      }));
      return auction;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update auction',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteAuction: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/auctions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete auction');

      set(state => ({
        auctions: state.auctions.filter(a => a.id !== id),
        currentAuction: state.currentAuction?.id === id ? null : state.currentAuction,
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete auction',
        isLoading: false 
      });
      throw error;
    }
  },

  updateAuctionStatus: async (id: string, status: AuctionStatus) => {
    await get().updateAuction(id, { status });
  },

  fetchBids: async (auctionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/auctions/${auctionId}/bids`);
      if (!response.ok) throw new Error('Failed to fetch bids');

      const bids: Bid[] = await response.json();
      set({ bids, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bids',
        isLoading: false 
      });
    }
  },

  removeBid: async (bidId: string, reason: string) => {
    try {
      const response = await fetch(`/api/bids/${bidId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error('Failed to remove bid');

      set(state => ({
        bids: state.bids.filter(b => b.id !== bidId),
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove bid'
      });
      throw error;
    }
  },

  extendAuction: async (id: string, endTime: Date) => {
    await get().updateAuction(id, { endTime });
  },

  pauseAuction: async (id: string) => {
    await get().updateAuctionStatus(id, 'paused');
  },

  resumeAuction: async (id: string) => {
    await get().updateAuctionStatus(id, 'active');
  },

  cancelAuction: async (id: string, reason: string) => {
    await get().updateAuction(id, { 
      status: 'cancelled',
      description: reason,
    });
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchAuctions(1, filters);
  },

  clearCurrentAuction: () => {
    set({ currentAuction: null, bids: [] });
  },
}));
