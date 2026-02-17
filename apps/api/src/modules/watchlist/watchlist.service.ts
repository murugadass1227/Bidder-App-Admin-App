import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WatchlistService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, auctionId: string, reminderAt?: Date): Promise<unknown> {
    const auction = await this.prisma.client.auction.findUnique({ where: { id: auctionId } });
    if (!auction) throw new NotFoundException("Auction not found");

    try {
      return await this.prisma.client.watchlist.create({
        data: { userId, auctionId, reminderAt },
        include: { auction: true },
      });
    } catch (e) {
      if ((e as { code?: string }).code === "P2002") throw new ConflictException("Already on watchlist");
      throw e;
    }
  }

  async remove(userId: string, auctionId: string) {
    const w = await this.prisma.client.watchlist.findUnique({
      where: { userId_auctionId: { userId, auctionId } },
    });
    if (!w) throw new NotFoundException("Watchlist entry not found");
    return this.prisma.client.watchlist.delete({ where: { id: w.id } });
  }

  async findByUser(userId: string): Promise<unknown[]> {
    return this.prisma.client.watchlist.findMany({
      where: { userId },
      include: { auction: { include: { yard: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async isOnWatchlist(userId: string, auctionId: string): Promise<boolean> {
    const w = await this.prisma.client.watchlist.findUnique({
      where: { userId_auctionId: { userId, auctionId } },
    });
    return !!w;
  }
}
