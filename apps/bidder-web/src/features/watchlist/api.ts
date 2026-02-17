import { api } from "@/lib/axios";
import type { WatchlistItem } from "@/types/global";

export async function getWatchlist(): Promise<WatchlistItem[]> {
  const res = await api.get<WatchlistItem[]>("/watchlist");
  return res.data;
}

export async function addToWatchlist(
  auctionId: string,
  reminderAt?: string
): Promise<WatchlistItem> {
  const res = await api.post<WatchlistItem>("/watchlist", {
    auctionId,
    reminderAt,
  });
  return res.data;
}

export async function removeFromWatchlist(auctionId: string): Promise<void> {
  await api.delete(`/watchlist/${auctionId}`);
}
