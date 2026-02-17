"use client";

import { useQuery } from "@tanstack/react-query";
import * as auctionApi from "./api";
import type { AuctionFilters } from "./api";

export function useAuctions(filters: AuctionFilters = {}) {
  return useQuery({
    queryKey: ["auctions", filters],
    queryFn: () => auctionApi.getAuctions(filters),
  });
}

export function useAuction(id: string | null) {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: () => auctionApi.getAuction(id!),
    enabled: !!id,
  });
}
