"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as bidApi from "./api";

export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { amount: number; maxBid?: number }) =>
      bidApi.placeBid(auctionId, payload.amount, payload.maxBid),
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      queryClient.invalidateQueries({ queryKey: ["bids", auctionId] });
    },
  });
}

export function useBidsByAuction(auctionId: string | null) {
  return useQuery({
    queryKey: ["bids", auctionId],
    queryFn: () => bidApi.getBidsByAuction(auctionId!),
    enabled: !!auctionId,
  });
}

export function useMyBids() {
  return useQuery({
    queryKey: ["bids", "my"],
    queryFn: () => bidApi.getMyBids(),
  });
}
