import { Server } from "socket.io";
import { BidService } from "../bid/bid.service";
import { CreateBidDto } from "../bid/dto/create-bid.dto";
export declare class BiddingGateway {
    private bidService;
    server: Server;
    private readonly logger;
    constructor(bidService: BidService);
    handleBid(payload: CreateBidDto & {
        userId: string;
    }, _client: unknown): Promise<{
        success: true;
        bid: unknown;
    } | {
        success: false;
        error: string;
    }>;
    handleJoin(auctionId: string, client: {
        join: (room: string) => void;
    }): void;
    handleLeave(auctionId: string, client: {
        leave: (room: string) => void;
    }): void;
}
//# sourceMappingURL=bidding.gateway.d.ts.map