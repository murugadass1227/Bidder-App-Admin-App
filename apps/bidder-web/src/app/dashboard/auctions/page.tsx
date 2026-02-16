"use client";

import { useAuctions } from "@/features/auction/hooks";
import { AuctionCard } from "@/features/auction/components/AuctionCard";

export default function AuctionsPage() {
  const { data: auctions, isLoading, error } = useAuctions("ACTIVE");

  if (isLoading) return <p className="text-gray-500">Loading auctions...</p>;
  const isConnectionRefused =
    error &&
    (String((error as { code?: string })?.code) === "ERR_NETWORK" ||
     String((error as Error)?.message).includes("Connection refused"));
  if (error) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <p className="font-medium">
          {isConnectionRefused ? "Cannot reach the API server." : "Failed to load auctions."}
        </p>
        {isConnectionRefused && (
          <p className="mt-2 text-sm">
            Make sure the API is running: from the project root run <code className="rounded bg-amber-100 px-1">pnpm dev</code> and
            wait until you see &quot;API listening on http://localhost:4000&quot;. You can also check{" "}
            <a href="http://localhost:4000/api/v1/health" target="_blank" rel="noopener noreferrer" className="underline">
              http://localhost:4000/api/v1/health
            </a>
            .
          </p>
        )}
      </div>
    );
  }
  if (!auctions?.length) return <p className="text-gray-500">No active auctions.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Active Auctions</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
}
