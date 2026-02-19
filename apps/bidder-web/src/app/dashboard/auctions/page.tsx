"use client";

import { useState } from "react";
import { useAuctions } from "@/features/auction/hooks";
import { AuctionCard } from "@/features/auction/components/AuctionCard";
import { Button, Input } from "@repo/ui";

export default function AuctionsPage() {
  const [status, setStatus] = useState<"ACTIVE" | "ENDED" | "">("ACTIVE");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [yard, setYard] = useState("");
  const [damageType, setDamageType] = useState("");
  const filters = {
    ...(status && { status }),
    ...(make && { make }),
    ...(model && { model }),
    ...(year && { year: Number(year) }),
    ...(yard && { yard }),
    ...(damageType && { damageType }),
  };
  const { data: auctions, isLoading, error } = useAuctions(filters);

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
  if (!auctions?.length) return <p className="text-gray-500">No auctions match your filters.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Browse lots</h1>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-3 items-end">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "ACTIVE" | "ENDED" | "")}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="ENDED">Ended</option>
        </select>
        <Input
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="max-w-[120px]"
        />
        <Input
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="max-w-[120px]"
        />
        <Input
          placeholder="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="max-w-[80px]"
        />
        <Input
          placeholder="Yard / location"
          value={yard}
          onChange={(e) => setYard(e.target.value)}
          className="max-w-[140px]"
        />
        <Input
          placeholder="Damage type"
          value={damageType}
          onChange={(e) => setDamageType(e.target.value)}
          className="max-w-[120px]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
}
