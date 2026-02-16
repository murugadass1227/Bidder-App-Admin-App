"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as bidApi from "./api";

export function usePlaceBid(auctionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => bidApi.placeBid(auctionId, amount),
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
