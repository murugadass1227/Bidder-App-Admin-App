import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { Prisma, AuctionStatus } from "@repo/db";
import type { BidWithUser, BidWithUserAndAuction } from "../../types/prisma";

@Injectable()
export class BidService {
  constructor(private prisma: PrismaService) {}

  async place(userId: string, dto: CreateBidDto): Promise<BidWithUserAndAuction> {
    const auction = await this.prisma.client.auction.findUnique({
      where: { id: dto.auctionId },
    });
    if (!auction) throw new NotFoundException("Auction not found");
    if (auction.status !== AuctionStatus.ACTIVE) {
      throw new BadRequestException("Auction is not active for bidding");
    }
    const current = Number(auction.currentPrice);
    if (dto.amount <= current) {
      throw new BadRequestException(`Bid must be greater than current price (${current})`);
    }

    const bid = await this.prisma.client.$transaction(async (tx) => {
      const created = await tx.bid.upsert({
        where: {
          auctionId_userId: { auctionId: dto.auctionId, userId },
        },
        create: {
          auctionId: dto.auctionId,
          userId,
          amount: new Prisma.Decimal(dto.amount),
        },
        update: { amount: new Prisma.Decimal(dto.amount) },
        include: { user: { select: { id: true, email: true, name: true } }, auction: true },
      });
      await tx.auction.update({
        where: { id: dto.auctionId },
        data: { currentPrice: new Prisma.Decimal(dto.amount) },
      });
      return created;
    });

    return bid;
  }

  async findByAuction(auctionId: string): Promise<BidWithUser[]> {
    return this.prisma.client.bid.findMany({
      where: { auctionId },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByUser(userId: string): Promise<BidWithUserAndAuction[]> {
    return this.prisma.client.bid.findMany({
      where: { userId },
      include: {
        auction: true,
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
