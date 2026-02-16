"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@repo/ui";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:4000/api/v1";

interface Auction {
  id: string;
  title: string;
  status: string;
  currentPrice: string | number;
  createdAt: string;
}

export default function AdminAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      window.location.href = "/login";
      return;
    }
    axios
      .get<Auction[]>(API_URL + "/auctions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAuctions(res.data))
      .catch(() => setAuctions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Auctions</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {auctions.map((a) => (
          <Card key={a.id}>
            <CardHeader title={a.title} subtitle={`Status: ${a.status}`} />
            <CardContent>
              <p className="font-semibold">
                ${Number(a.currentPrice).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {auctions.length === 0 && (
        <p className="text-gray-500">No auctions. Create one via API.</p>
      )}
    </div>
  );
}
