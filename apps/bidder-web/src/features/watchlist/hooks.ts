"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as watchlistApi from "./api";

export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: watchlistApi.getWatchlist,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { auctionId: string; reminderAt?: string }) =>
      watchlistApi.addToWatchlist(payload.auctionId, payload.reminderAt),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: string) => watchlistApi.removeFromWatchlist(auctionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}
