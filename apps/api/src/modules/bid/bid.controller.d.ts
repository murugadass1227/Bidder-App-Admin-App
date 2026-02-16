import { BidService } from "./bid.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import type { BidWithUser, BidWithUserAndAuction } from "../../types/prisma";
export declare class BidController {
    private bidService;
    constructor(bidService: BidService);
    place(userId: string, dto: CreateBidDto): Promise<BidWithUserAndAuction>;
    findByAuction(auctionId: string): Promise<BidWithUser[]>;
    myBids(userId: string): Promise<BidWithUserAndAuction[]>;
}
//# sourceMappingURL=bid.controller.d.ts.map