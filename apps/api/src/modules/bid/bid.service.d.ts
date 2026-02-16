import { PrismaService } from "../../prisma/prisma.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import type { BidWithUser, BidWithUserAndAuction } from "../../types/prisma";
export declare class BidService {
    private prisma;
    constructor(prisma: PrismaService);
    place(userId: string, dto: CreateBidDto): Promise<BidWithUserAndAuction>;
    findByAuction(auctionId: string): Promise<BidWithUser[]>;
    findByUser(userId: string): Promise<BidWithUserAndAuction[]>;
}
//# sourceMappingURL=bid.service.d.ts.map