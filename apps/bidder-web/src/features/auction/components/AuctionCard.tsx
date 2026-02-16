"use client";

import Link from "next/link";
import { Card, CardHeader, CardContent } from "@repo/ui";
import { formatCurrency } from "@/lib/utils";
import type { Auction } from "../types";

interface AuctionCardProps {
  auction: Auction;
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const price = Number(auction.currentPrice);
  return (
    <Link href={`/dashboard/auctions/${auction.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader title={auction.title} subtitle={auction.description ?? undefined} />
        <CardContent>
          <p className="text-lg font-semibold text-primary-600">
            {formatCurrency(price)}
          </p>
          <p className="text-sm text-gray-500 capitalize">{auction.status}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
