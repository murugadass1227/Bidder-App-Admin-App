export type Role = "ADMIN" | "BIDDER";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: User;
}

export type AuctionStatus = "DRAFT" | "ACTIVE" | "ENDED" | "CANCELLED";

export interface Auction {
  id: string;
  title: string;
  description: string | null;
  startPrice: number | string;
  currentPrice: number | string;
  status: AuctionStatus;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator?: { id: string; email: string; name: string | null };
}

export interface Bid {
  id: string;
  amount: number | string;
  createdAt: string;
  userId: string;
  auctionId: string;
  user?: { id: string; email: string; name: string | null };
}
