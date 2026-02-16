"use client";

import { useQuery } from "@tanstack/react-query";
import * as auctionApi from "./api";
import type { AuctionStatus } from "./types";

export function useAuctions(status?: AuctionStatus) {
  return useQuery({
    queryKey: ["auctions", status],
    queryFn: () => auctionApi.getAuctions(status),
  });
}

export function useAuction(id: string | null) {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: () => auctionApi.getAuction(id!),
    enabled: !!id,
  });
}
