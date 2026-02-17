import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { Prisma, AuctionStatus } from "@repo/db";
import type { BidWithUser, BidWithUserAndAuction } from "../../types/prisma";

@Injectable()
export class BidService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}

  async place(userId: string, dto: CreateBidDto): Promise<BidWithUserAndAuction> {
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    if (!this.userService.canBid(user)) {
      throw new ForbiddenException(
        "Bidding is not enabled. Complete account verification (email, mobile, reservation proof) and KYC approval."
      );
    }

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

    const bidAmount = new Prisma.Decimal(dto.amount);
    const maxBid = dto.maxBid != null ? new Prisma.Decimal(dto.maxBid) : undefined;
    if (maxBid != null && maxBid.lessThan(bidAmount)) {
      throw new BadRequestException("maxBid must be >= amount");
    }

    const now = new Date();
    const endsAt = auction.endsAt ? new Date(auction.endsAt) : null;
    const extendMinutes = auction.extendMinutes ?? 0;
    const shouldExtend =
      extendMinutes > 0 &&
      endsAt &&
      endsAt.getTime() - now.getTime() <= extendMinutes * 60 * 1000;
    const newEndsAt = shouldExtend && endsAt
      ? new Date(endsAt.getTime() + extendMinutes * 60 * 1000)
      : undefined;

    const bid = await this.prisma.client.$transaction(async (tx) => {
      const created = await tx.bid.upsert({
        where: {
          auctionId_userId: { auctionId: dto.auctionId, userId },
        },
        create: {
          auctionId: dto.auctionId,
          userId,
          amount: bidAmount,
          maxBid: maxBid ?? undefined,
        },
        update: {
          amount: bidAmount,
          ...(maxBid != null && { maxBid }),
        },
        include: { user: { select: { id: true, email: true, name: true } }, auction: true },
      });
      await tx.auction.update({
        where: { id: dto.auctionId },
        data: {
          currentPrice: bidAmount,
          ...(newEndsAt && { endsAt: newEndsAt }),
        },
      });
      return created;
    });

    return bid;
  }

  /** Bid history with anonymized bidder ID (e.g. "Bidder #a1b2") for display */
  async findByAuction(auctionId: string): Promise<(BidWithUser & { bidderDisplayId: string })[]> {
    const bids = await this.prisma.client.bid.findMany({
      where: { auctionId },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return bids.map((b, i) => ({
      ...b,
      bidderDisplayId: "Bidder #" + b.userId.slice(-6).toUpperCase(),
    }));
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
