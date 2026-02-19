"use client";

import Link from "next/link";
import { useMyBids } from "@/features/bid/hooks";
import { useWonLots, useMyInvoices } from "@/features/user/hooks";
import { formatCurrency } from "@/lib/utils";

export default function MyActivityPage() {
  const { data: myBids } = useMyBids();
  const { data: wonLots, isLoading: wonLoading } = useWonLots();
  const { data: invoices, isLoading: invLoading } = useMyInvoices();

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">My activity</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">Active bids</h2>
        <p className="text-sm text-gray-600 mb-2">
          Lots you have placed a bid on (see current status on each lot).
        </p>
        {myBids && myBids.length > 0 ? (
          <ul className="space-y-2">
            {myBids?.map((bid) => (
              <li key={bid.id} className="flex justify-between items-center border-b pb-2">
                <Link
                  href={`/dashboard/auctions/${bid.auctionId}`}
                  className="text-primary-600 hover:underline"
                >
                  {bid.auction?.title ?? `Lot ${bid.auctionId}`}
                </Link>
                <span className="font-medium">{formatCurrency(Number(bid.amount))}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bids yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Won lots</h2>
        <p className="text-sm text-gray-600 mb-2">
          Lots you have won. Complete payment to get your release note.
        </p>
        {wonLoading && <p className="text-gray-500">Loading…</p>}
        {!wonLoading && wonLots && wonLots.length > 0 ? (
          <ul className="space-y-2">
            {wonLots.map((lot) => (
              <li key={lot.id} className="flex justify-between items-center border-b pb-2">
                <Link href={`/dashboard/auctions/${lot.id}`} className="text-primary-600 hover:underline">
                  {lot.title}
                </Link>
                <span className="text-green-700 font-medium">Won</span>
              </li>
            ))}
          </ul>
        ) : !wonLoading && (
          <p className="text-gray-500">No won lots yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Invoices & payment</h2>
        <p className="text-sm text-gray-600 mb-2">
          Pay via EFT/card; download release note once paid.
        </p>
        {invLoading && <p className="text-gray-500">Loading…</p>}
        {!invLoading && invoices && invoices.length > 0 ? (
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li key={inv.id} className="flex justify-between items-center border-b pb-2">
                <span>
                  {inv.auction?.title ?? inv.auctionId} · {inv.invoiceNumber}
                </span>
                <span>
                  {formatCurrency(Number(inv.amount))}{" "}
                  {inv.status === "PAID" ? (
                    <span className="text-green-700">Paid</span>
                  ) : (
                    <span className="text-amber-700">Pending</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : !invLoading && (
          <p className="text-gray-500">No invoices yet.</p>
        )}
      </section>
    </div>
  );
}
