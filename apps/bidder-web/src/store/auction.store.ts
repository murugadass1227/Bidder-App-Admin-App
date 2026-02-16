import { create } from "zustand";
import type { Auction } from "@/types/global";

interface AuctionState {
  currentPrice: Record<string, number>;
  setCurrentPrice: (auctionId: string, price: number) => void;
  setAuction: (auction: Auction) => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  currentPrice: {},
  setCurrentPrice: (auctionId, price) =>
    set((s) => ({ currentPrice: { ...s.currentPrice, [auctionId]: price } })),
  setAuction: (auction) =>
    set((s) => ({
      currentPrice: {
        ...s.currentPrice,
        [auction.id]: Number(auction.currentPrice),
      },
    })),
}));
