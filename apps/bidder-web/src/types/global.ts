export type Role =
  | "ADMIN"
  | "BIDDER"
  | "SALVAGE_YARD_OPERATOR"
  | "INSURER_ASSESSOR";

export type KycStatus = "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  fullName: string | null;
  mobile: string | null;
  role: Role;
  emailVerifiedAt: string | null;
  mobileVerifiedAt: string | null;
  reservationProofUrl: string | null;
  reservationProofVerifiedAt: string | null;
  physicalAddress: string | null;
  preferredPaymentMethod: string | null;
  companyDetails: string | null;
  kycStatus: KycStatus;
  requiresVerification?: boolean;
  canBid?: boolean;
  kycDocuments?: Array<{
    id: string;
    documentType: string;
    fileUrl: string;
    status: KycStatus;
  }>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: User;
  requiresVerification?: boolean;
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
  make?: string | null;
  model?: string | null;
  year?: number | null;
  vin?: string | null;
  engineNumber?: string | null;
  mileage?: number | null;
  accidentSummary?: string | null;
  damageNotes?: string | null;
  damageType?: string | null;
  yardId?: string | null;
  yard?: { id: string; name: string; location: string | null; address: string | null } | null;
  yardName?: string | null;
  yardLocation?: string | null;
  inspectionTimes?: string | null;
  viewingInstructions?: string | null;
  photoUrls?: string | null;
  videoUrl?: string | null;
  reservePrice?: number | string | null;
  bidIncrement?: number | string | null;
  buyerFees?: number | string | null;
  vatTaxes?: number | string | null;
  extendMinutes?: number | null;
}

export interface Bid {
  id: string;
  amount: number | string;
  maxBid?: number | string | null;
  createdAt: string;
  userId: string;
  auctionId: string;
  user?: { id: string; email: string; name: string | null };
  bidderDisplayId?: string;
  auction?: { id: string; title: string; status?: string };
}

export interface WatchlistItem {
  id: string;
  userId: string;
  auctionId: string;
  reminderAt: string | null;
  createdAt: string;
  auction: Auction;
}

export interface Invoice {
  id: string;
  userId: string;
  auctionId: string;
  amount: number | string;
  fees: number | string;
  taxes: number | string;
  status: "PENDING" | "PAID" | "CANCELLED";
  invoiceNumber: string;
  paidAt: string | null;
  releaseNoteUrl: string | null;
  createdAt: string;
  auction?: { id: string; title: string };
}
