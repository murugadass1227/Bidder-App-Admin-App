export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  mobile?: string;
  role: 'ADMIN' | 'BIDDER' | 'SALVAGE_YARD_OPERATOR' | 'INSURER_ASSESSOR';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  kycStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  totalBids?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Lot {
  id: string;
  title: string;
  description: string;
  vehicleDetails: VehicleDetails;
  damageDescription: string;
  location: string;
  reservePrice?: number;
  buyNowPrice?: number;
  bidIncrementRules: BidIncrementRules;
  images: LotFile[];
  videos: LotFile[];
  documents: LotFile[];
  status: LotStatus;
  auctionId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  engineType: string;
  transmission: string;
  color: string;
  motorCodingModel?: string;
}

export interface BidIncrementRules {
  minIncrement: number;
  maxIncrement?: number;
  incrementPercentage?: number;
}

export interface LotFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  accessLevel: 'public' | 'bidder_only' | 'winner_only';
  uploadedAt: Date;
}

export type LotStatus = 
  | 'draft' 
  | 'ready' 
  | 'published' 
  | 'in_auction' 
  | 'sold' 
  | 'unsold' 
  | 'released' 
  | 'closed';

export interface Auction {
  id: string;
  name: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  type: 'timed_online' | 'open';
  status: AuctionStatus;
  lotIds: string[];
  rules: AuctionRules;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AuctionStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'cancelled';

export interface AuctionRules {
  minOpeningBid: number;
  bidIncrementRules: BidIncrementRules;
  antiSnipingEnabled: boolean;
  antiSnipingTime?: number; // in minutes
  reservePriceEnabled: boolean;
}

export interface Bid {
  id: string;
  lotId: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'outbid' | 'winning';
  isSuspicious: boolean;
  suspiciousReason?: string;
}

export interface Approval {
  id: string;
  type: 'reserve_price' | 'auction';
  entityId: string;
  entityType: 'lot' | 'auction';
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: Date;
  reviewedAt?: Date;
}

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  description?: string;
  data: any;
  generatedAt: Date;
  generatedBy: string;
  filters?: ReportFilters;
}

export type ReportType = 
  | 'sales_report'
  | 'bidder_participation'
  | 'lot_performance'
  | 'settlement_vs_reserve'
  | 'vehicle_classifications'
  | 'time_to_disposal'
  | 'bidder_activity_heatmap'
  | 'unsold_stock_aging'
  | 'kyc_completeness';

export interface ReportFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  auctionIds?: string[];
  lotIds?: string[];
  userIds?: string[];
  status?: string[];
}

export interface DashboardStats {
  totalLots: number;
  activeAuctions: number;
  totalBids: number;
  totalUsers: number;
  pendingApprovals: number;
  unsoldLots90Days: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'lot_created' | 'auction_started' | 'bid_placed' | 'user_registered';
  description: string;
  timestamp: Date;
  userId?: string;
  entityId?: string;
}

export interface MotorCodingModel {
  rating: string;
  factors: {
    condition: number;
    marketDemand: number;
    age: number;
    mileage: number;
    location: number;
  };
  suggestedReserve: number;
  confidence: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
