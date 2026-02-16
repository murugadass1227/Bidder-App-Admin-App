"use client";

import { useState } from "react";
import { Button, Input } from "@repo/ui";
import { usePlaceBid } from "../hooks";
import { formatCurrency } from "@/lib/utils";

interface PlaceBidFormProps {
  auctionId: string;
  currentPrice: number;
}

export function PlaceBidForm({ auctionId, currentPrice }: PlaceBidFormProps) {
  const [amount, setAmount] = useState(currentPrice + 1);
  const placeBid = usePlaceBid(auctionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= currentPrice) return;
    placeBid.mutate(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Your bid (min {formatCurrency(currentPrice + 0.01)})"
        type="number"
        min={currentPrice + 0.01}
        step={0.01}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
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
