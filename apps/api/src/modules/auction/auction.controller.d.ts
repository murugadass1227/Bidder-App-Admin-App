import { AuctionService } from "./auction.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { AuctionStatus } from "@repo/db";
import type { Auction } from "@repo/db";
import type { AuctionWithCreator, AuctionWithCreatorAndBids } from "../../types/prisma";
export declare class AuctionController {
    private auctionService;
    constructor(auctionService: AuctionService);
    findAll(status?: AuctionStatus): Promise<AuctionWithCreator[]>;
    findOne(id: string): Promise<AuctionWithCreatorAndBids>;
    create(userId: string, dto: CreateAuctionDto): Promise<AuctionWithCreator>;
    update(id: string, dto: UpdateAuctionDto): Promise<AuctionWithCreator>;
    remove(id: string): Promise<Auction>;
}
//# sourceMappingURL=auction.controller.d.ts.map