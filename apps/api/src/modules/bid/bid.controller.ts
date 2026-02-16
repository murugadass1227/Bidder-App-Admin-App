import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { BidService } from "./bid.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import type { BidWithUser, BidWithUserAndAuction } from "../../types/prisma";

@Controller("bids")
@UseGuards(JwtAuthGuard)
export class BidController {
  constructor(private bidService: BidService) {}

  @Post()
  async place(@CurrentUser("sub") userId: string, @Body() dto: CreateBidDto): Promise<BidWithUserAndAuction> {
    return this.bidService.place(userId, dto);
  }

  @Get("auction/:auctionId")
  @Public()
  async findByAuction(@Param("auctionId") auctionId: string): Promise<BidWithUser[]> {
    return this.bidService.findByAuction(auctionId);
  }

  @Get("my")
  async myBids(@CurrentUser("sub") userId: string): Promise<BidWithUserAndAuction[]> {
    return this.bidService.findByUser(userId);
  }
}
