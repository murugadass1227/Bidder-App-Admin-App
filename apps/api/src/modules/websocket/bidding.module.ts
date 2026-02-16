import { Module } from "@nestjs/common";
import { BiddingGateway } from "./bidding.gateway";
import { BidModule } from "../bid/bid.module";

@Module({
  imports: [BidModule],
  providers: [BiddingGateway],
})
export class BiddingGatewayModule {}
