import { api } from "@/lib/axios";
import type { Auction, AuctionStatus } from "./types";

export interface AuctionFilters {
  status?: AuctionStatus;
  make?: string;
  model?: string;
  year?: number;
  yard?: string;
  location?: string;
  damageType?: string;
}

export async function getAuctions(filters: AuctionFilters = {}): Promise<Auction[]> {
  const params: Record<string, string | number> = {};
  if (filters.status) params.status = filters.status;
  if (filters.make) params.make = filters.make;
  if (filters.model) params.model = filters.model;
  if (filters.year) params.year = filters.year;
  if (filters.yard) params.yard = filters.yard;
  if (filters.location) params.location = filters.location;
  if (filters.damageType) params.damageType = filters.damageType;
  const res = await api.get<Auction[]>("/auctions", { params });
  return res.data;
}

export async function getAuction(id: string): Promise<Auction> {
  const res = await api.get<Auction>(`/auctions/${id}`);
  return res.data;
}
