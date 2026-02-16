import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Logger } from "@nestjs/common";
import { BidService } from "../bid/bid.service";
import { CreateBidDto } from "../bid/dto/create-bid.dto";

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "bidding",
})
export class BiddingGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(BiddingGateway.name);

  constructor(private bidService: BidService) {}

  @SubscribeMessage("bid")
  async handleBid(
    @MessageBody() payload: CreateBidDto & { userId: string },
    @ConnectedSocket() _client: unknown
  ): Promise<{ success: true; bid: unknown } | { success: false; error: string }> {
    const { userId, ...dto } = payload;
    if (!userId) {
      this.logger.warn("Bid received without userId");
      return { success: false, error: "Unauthorized" };
    }
    try {
      const bid = await this.bidService.place(userId, dto);
      const auctionId = dto.auctionId;
      this.server.to(`auction:${auctionId}`).emit("bid:update", {
        bid: {
          id: bid.id,
          amount: Number(bid.amount),
          userId: bid.userId,
          createdAt: bid.createdAt,
          user: bid.user,
        },
        currentPrice: Number(bid.auction.currentPrice),
      });
      return { success: true, bid };
    } catch (err) {
      this.logger.error(err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to place bid",
      };
    }
  }

  @SubscribeMessage("join")
  handleJoin(
    @MessageBody() auctionId: string,
    @ConnectedSocket() client: { join: (room: string) => void }
  ) {
    client.join(`auction:${auctionId}`);
  }

  @SubscribeMessage("leave")
  handleLeave(
    @MessageBody() auctionId: string,
    @ConnectedSocket() client: { leave: (room: string) => void }
  ) {
    client.leave(`auction:${auctionId}`);
  }
}
