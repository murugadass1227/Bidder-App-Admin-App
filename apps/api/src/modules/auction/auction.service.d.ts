import { PrismaService } from "../../prisma/prisma.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { AuctionStatus } from "@repo/db";
import type { AuctionWithCreator, AuctionWithCreatorAndBids } from "../../types/prisma";
import type { Auction } from "@repo/db";
export declare class AuctionService {
    private prisma;
    constructor(prisma: PrismaService);
    create(creatorId: string, dto: CreateAuctionDto): Promise<AuctionWithCreator>;
    findAll(status?: AuctionStatus): Promise<AuctionWithCreator[]>;
    findOne(id: string): Promise<AuctionWithCreatorAndBids>;
    update(id: string, dto: UpdateAuctionDto): Promise<AuctionWithCreator>;
    remove(id: string): Promise<Auction>;
}
//# sourceMappingURL=auction.service.d.ts.map