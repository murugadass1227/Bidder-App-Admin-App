import { Controller, Get, Post, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { WatchlistService } from "./watchlist.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("watchlist")
@UseGuards(JwtAuthGuard)
export class WatchlistController {
  constructor(private watchlistService: WatchlistService) {}

  @Post()
  async add(
    @CurrentUser("sub") userId: string,
    @Body() body: { auctionId: string; reminderAt?: string }
  ): Promise<unknown> {
    const reminderAt = body.reminderAt ? new Date(body.reminderAt) : undefined;
    return this.watchlistService.add(userId, body.auctionId, reminderAt);
  }

  @Delete(":auctionId")
  async remove(@CurrentUser("sub") userId: string, @Param("auctionId") auctionId: string) {
    return this.watchlistService.remove(userId, auctionId);
  }

  @Get()
  async mine(@CurrentUser("sub") userId: string): Promise<unknown[]> {
    return this.watchlistService.findByUser(userId);
  }
}
