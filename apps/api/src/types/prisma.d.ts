import type { Auction, Bid, User } from "@repo/db";
export type AuctionWithCreator = Auction & {
    creator: {
        id: string;
        email: string;
        name: string | null;
    };
};
export type AuctionWithCreatorAndBids = Auction & {
    creator: {
        id: string;
        email: string;
        name: string | null;
    };
    bids: BidWithUser[];
};
export type BidWithUser = Bid & {
    user: {
        id: string;
        email: string;
        name: string | null;
    };
};
export type BidWithUserAndAuction = Bid & {
    user: {
        id: string;
        email: string;
        name: string | null;
    };
    auction: Auction;
};
export type UserWithoutPassword = Omit<User, "passwordHash">;
//# sourceMappingURL=prisma.d.ts.map