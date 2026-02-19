import { api } from "@/lib/axios";
import type { Auction, Invoice } from "@/types/global";

export async function getWonLots(): Promise<Auction[]> {
  const res = await api.get<Auction[]>("/users/me/won");
  return res.data;
}

export async function getMyInvoices(): Promise<Invoice[]> {
  const res = await api.get<Invoice[]>("/users/me/invoices");
  return res.data;
}
