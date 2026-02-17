"use client";

import { use } from "react";
import Link from "next/link";
import { useAuction } from "@/features/auction/hooks";
import { useBidsByAuction } from "@/features/bid/hooks";
import { PlaceBidForm } from "@/features/bid/components/PlaceBidForm";
import { WatchlistButton } from "@/features/watchlist/components/WatchlistButton";
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
  const bidIncrement = Number(auction.bidIncrement) || 1;
  const photos: string[] = auction.photoUrls
    ? (typeof auction.photoUrls === "string"
        ? (() => {
            try {
              return JSON.parse(auction.photoUrls) as string[];
            } catch {
              return [];
            }
          })()
        : [])
    : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold">{auction.title}</h1>
        <WatchlistButton auctionId={id} />
      </div>

      <Card>
        <CardHeader
          title="Vehicle / lot"
          subtitle={auction.description ?? undefined}
        />
        <CardContent className="space-y-3">
          {(auction.make || auction.model || auction.year) && (
            <p className="font-medium">
              {[auction.make, auction.model, auction.year].filter(Boolean).join(" ")}
            </p>
          )}
          {auction.vin && <p className="text-sm text-gray-600">VIN: {auction.vin}</p>}
          {auction.mileage != null && (
            <p className="text-sm text-gray-600">Mileage: {auction.mileage.toLocaleString()} km</p>
          )}
          {auction.accidentSummary && (
            <div>
              <p className="text-sm font-medium text-gray-700">Accident summary</p>
              <p className="text-sm text-gray-600">{auction.accidentSummary}</p>
            </div>
          )}
          {auction.damageNotes && (
            <div>
              <p className="text-sm font-medium text-gray-700">Damage notes</p>
              <p className="text-sm text-gray-600">{auction.damageNotes}</p>
            </div>
          )}
          {auction.damageType && (
            <p className="text-sm text-gray-600">Damage type: {auction.damageType}</p>
          )}
        </CardContent>
      </Card>

      {(auction.yardName || auction.yardLocation || auction.inspectionTimes) && (
        <Card>
          <CardHeader title="Location & inspection" />
          <CardContent className="space-y-2 text-sm">
            {auction.yardName && <p><strong>Yard:</strong> {auction.yardName}</p>}
            {auction.yardLocation && <p><strong>Location:</strong> {auction.yardLocation}</p>}
            {auction.inspectionTimes && (
              <p><strong>Inspection times:</strong> {auction.inspectionTimes}</p>
            )}
            {auction.viewingInstructions && (
              <p><strong>Viewing:</strong> {auction.viewingInstructions}</p>
            )}
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && (
        <Card>
          <CardHeader title="Photos" />
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {photos.slice(0, 6).map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-24 h-24 rounded border bg-gray-100 bg-cover bg-center"
                  style={{ backgroundImage: `url(${url})` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader title="Auction" />
        <CardContent className="space-y-4">
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(currentPrice)}
          </p>
          <p className="text-sm text-gray-500 capitalize">Status: {auction.status}</p>
          {auction.startsAt && (
            <p className="text-sm">Starts: {new Date(auction.startsAt).toLocaleString()}</p>
          )}
          {auction.endsAt && (
            <p className="text-sm">Ends: {new Date(auction.endsAt).toLocaleString()}</p>
          )}
          {auction.reservePrice != null && (
            <p className="text-sm text-gray-600">Reserve: {formatCurrency(Number(auction.reservePrice))}</p>
          )}
          {(auction.buyerFees != null || auction.vatTaxes != null) && (
            <p className="text-sm text-gray-600">
              Buyer fees: {auction.buyerFees != null ? formatCurrency(Number(auction.buyerFees)) : "—"} · VAT/taxes:{" "}
              {auction.vatTaxes != null ? formatCurrency(Number(auction.vatTaxes)) : "—"}
            </p>
          )}
          {isActive && (
            <PlaceBidForm
              auctionId={id}
              currentPrice={currentPrice}
              bidIncrement={bidIncrement}
            />
          )}
        </CardContent>
      </Card>

      {bids && bids.length > 0 && (
        <Card>
          <CardHeader title="Bid history" />
          <CardContent>
            <ul className="space-y-2">
              {bids.map((bid) => (
                <li
                  key={bid.id}
                  className="flex justify-between text-sm border-b border-gray-100 pb-2"
                >
                  <span>{(bid as { bidderDisplayId?: string }).bidderDisplayId ?? bid.user?.email ?? "Bidder"}</span>
                  <span className="font-medium">{formatCurrency(Number(bid.amount))}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <p>
        <Link href="/dashboard/auctions" className="text-primary-600 hover:underline">
          ← Back to lots
        </Link>
      </p>
    </div>
  );
}
