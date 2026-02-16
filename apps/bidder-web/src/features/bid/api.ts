import { api } from "@/lib/axios";
import type { Bid } from "./types";

export async function placeBid(auctionId: string, amount: number) {
  const res = await api.post<Bid>("/bids", { auctionId, amount });
  return res.data;
}

export async function getBidsByAuction(auctionId: string): Promise<Bid[]> {
  const res = await api.get<Bid[]>(`/bids/auction/${auctionId}`);
  return res.data;
}

export async function getMyBids(): Promise<Bid[]> {
  const res = await api.get<Bid[]>("/bids/my");
  return res.data;
}
