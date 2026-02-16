import { AuctionStatus } from "@repo/db";
export declare class CreateAuctionDto {
    title: string;
    description?: string;
    startPrice: number;
    status?: AuctionStatus;
    startsAt?: Date;
    endsAt?: Date;
}
//# sourceMappingURL=create-auction.dto.d.ts.map