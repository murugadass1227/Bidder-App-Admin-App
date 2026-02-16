import { api } from "@/lib/axios";
import type { Auction, AuctionStatus } from "./types";

export async function getAuctions(status?: AuctionStatus): Promise<Auction[]> {
  const params = status ? { status } : {};
  const res = await api.get<Auction[]>("/auctions", { params });
  return res.data;
}

export async function getAuction(id: string): Promise<Auction> {
  const res = await api.get<Auction>(`/auctions/${id}`);
  return res.data;
}
