import type { Bid } from "@/types/global";

export type { Bid };

export interface PlaceBidInput {
  auctionId: string;
  amount: number;
}
