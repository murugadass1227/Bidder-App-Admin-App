"use client";

import { Button } from "@repo/ui";
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from "../hooks";

interface WatchlistButtonProps {
  auctionId: string;
  className?: string;
}

export function WatchlistButton({ auctionId, className }: WatchlistButtonProps) {
  const { data: list } = useWatchlist();
  const add = useAddToWatchlist();
  const remove = useRemoveFromWatchlist();
  const onList = list?.some((w) => w.auctionId === auctionId) ?? false;

  const handleClick = () => {
    if (onList) remove.mutate(auctionId);
    else add.mutate({ auctionId });
  };

  return (
    <Button
      type="button"
      variant={onList ? "secondary" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={add.isPending || remove.isPending}
      className={className}
    >
      {onList ? "Saved" : "Save to watchlist"}
    </Button>
  );
}
