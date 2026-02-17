import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { QueryAuctionsDto } from "./dto/query-auctions.dto";
import { AuctionStatus, Prisma } from "@repo/db";
import type { AuctionWithCreator, AuctionWithCreatorAndBids } from "../../types/prisma";
import type { Auction } from "@repo/db";

function maskVin(vin: string | null): string | null {
  if (!vin || vin.length < 4) return vin;
  return vin.slice(0, 2) + "***" + vin.slice(-2);
}

@Injectable()
export class AuctionService {
  constructor(private prisma: PrismaService) {}

  async create(creatorId: string, dto: CreateAuctionDto): Promise<AuctionWithCreator> {
    return this.prisma.client.auction.create({
      data: {
        title: dto.title,
        description: dto.description,
        startPrice: new Prisma.Decimal(dto.startPrice),
        currentPrice: new Prisma.Decimal(dto.startPrice),
        status: dto.status ?? AuctionStatus.DRAFT,
        startsAt: dto.startsAt,
        endsAt: dto.endsAt,
        creatorId,
      },
      include: { creator: { select: { id: true, email: true, name: true } } },
    });
  }

  async findAll(query: QueryAuctionsDto = {}): Promise<AuctionWithCreator[]> {
    const where: Prisma.AuctionWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.make) where.make = { contains: query.make };
    if (query.model) where.model = { contains: query.model };
    if (query.year) where.year = query.year;
    if (query.yard) where.yardName = { contains: query.yard };
    if (query.location) where.yardLocation = { contains: query.location };
    if (query.damageType) where.damageType = { contains: query.damageType };

    return this.prisma.client.auction.findMany({
      where,
      include: {
        creator: { select: { id: true, email: true, name: true } },
        yard: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Get lot detail; mask VIN/engine for bidders unless permitted (admin sees full) */
  async findOne(id: string, options?: { maskSensitive?: boolean }): Promise<AuctionWithCreatorAndBids> {
    const auction = await this.prisma.client.auction.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, email: true, name: true } },
        yard: true,
        bids: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    });
    if (!auction) throw new NotFoundException("Auction not found");

    if (options?.maskSensitive) {
      (auction as { vin?: string | null; engineNumber?: string | null }).vin = maskVin(auction.vin);
      (auction as { engineNumber?: string | null }).engineNumber = auction.engineNumber
        ? maskVin(auction.engineNumber)
        : null;
    }
    return auction as AuctionWithCreatorAndBids;
  }

  async update(id: string, dto: UpdateAuctionDto): Promise<AuctionWithCreator> {
    await this.findOne(id);
    const data: {
      title?: string;
      description?: string;
      startPrice?: Prisma.Decimal;
      currentPrice?: Prisma.Decimal;
      status?: AuctionStatus;
      startsAt?: Date | null;
      endsAt?: Date | null;
    } = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.startsAt !== undefined) data.startsAt = dto.startsAt;
    if (dto.endsAt !== undefined) data.endsAt = dto.endsAt;
    if (dto.startPrice !== undefined) {
      data.startPrice = new Prisma.Decimal(dto.startPrice);
      data.currentPrice = new Prisma.Decimal(dto.startPrice);
    }
    return this.prisma.client.auction.update({
      where: { id },
      data,
      include: { creator: { select: { id: true, email: true, name: true } } },
    });
  }

  async remove(id: string): Promise<Auction> {
    await this.findOne(id);
    return this.prisma.client.auction.delete({ where: { id } });
  }
}
