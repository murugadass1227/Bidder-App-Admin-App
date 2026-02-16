import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { AuctionStatus, Prisma } from "@repo/db";
import type { AuctionWithCreator, AuctionWithCreatorAndBids } from "../../types/prisma";
import type { Auction } from "@repo/db";

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

  async findAll(status?: AuctionStatus): Promise<AuctionWithCreator[]> {
    const where = status ? { status } : {};
    return this.prisma.client.auction.findMany({
      where,
      include: { creator: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string): Promise<AuctionWithCreatorAndBids> {
    const auction = await this.prisma.client.auction.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, email: true, name: true } },
        bids: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    });
    if (!auction) throw new NotFoundException("Auction not found");
    return auction;
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
