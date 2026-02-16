"use client";

import { use } from "react";
import { useAuction } from "@/features/auction/hooks";
import { useBidsByAuction } from "@/features/bid/hooks";
import { PlaceBidForm } from "@/features/bid/components/PlaceBidForm";
import { Card, CardHeader, CardContent } from "@repo/ui";
import { formatCurrency } from "@/lib/utils";

export default function AuctionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: auction, isLoading, error } = useAuction(id);
  const { data: bids } = useBidsByAuction(id);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error || !auction) return <p className="text-red-600">Auction not found.</p>;

  const currentPrice = Number(auction.currentPrice);
  const isActive = auction.status === "ACTIVE";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader
          title={auction.title}
          subtitle={auction.description ?? undefined}
        />
        <CardContent className="space-y-4">
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(currentPrice)}
          </p>
          <p className="text-sm text-gray-500 capitalize">Status: {auction.status}</p>
          {isActive && (
            <PlaceBidForm auctionId={id} currentPrice={currentPrice} />
          )}
        </CardContent>
      </Card>
      {bids && bids.length > 0 && (
        <Card>
          <CardHeader title="Recent bids" />
          <CardContent>
            <ul className="space-y-2">
              {bids.map((bid) => (
                <li
                  key={bid.id}
                  className="flex justify-between text-sm border-b border-gray-100 pb-2"
                >
                  <span>{bid.user?.email ?? bid.userId}</span>
                  <span className="font-medium">
                    {formatCurrency(Number(bid.amount))}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
