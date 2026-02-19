"use client";

import { useState } from "react";
import { Button, Input } from "@repo/ui";
import { usePlaceBid } from "../hooks";
import { formatCurrency } from "@/lib/utils";

interface PlaceBidFormProps {
  auctionId: string;
  currentPrice: number;
  bidIncrement?: number;
}

export function PlaceBidForm({
  auctionId,
  currentPrice,
  bidIncrement = 1,
}: PlaceBidFormProps) {
  const [amount, setAmount] = useState(currentPrice + bidIncrement);
  const [maxBid, setMaxBid] = useState<number | "">("");
  const placeBid = usePlaceBid(auctionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= currentPrice) return;
    placeBid.mutate({
      amount,
      maxBid: maxBid === "" ? undefined : maxBid,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Your bid (min {formatCurrency(currentPrice + Number(bidIncrement) || 0.01)})"
        type="number"
        min={currentPrice + 0.01}
        step={bidIncrement || 0.01}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Input
        label="Max bid for auto-bid (optional)"
        type="number"
        min={amount}
        step={bidIncrement || 0.01}
        value={maxBid === "" ? "" : maxBid}
        onChange={(e) =>
          setMaxBid(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="Leave empty for one-time bid"
      />
      <Button type="submit" isLoading={placeBid.isPending} fullWidth>
        Place bid
      </Button>
      {placeBid.isError && (
        <p className="text-sm text-red-600">{(placeBid.error as Error).message}</p>
      )}
    </form>
  );
}
