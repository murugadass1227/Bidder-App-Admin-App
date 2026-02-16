import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuctionService } from "./auction.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "@repo/db";
import { AuctionStatus } from "@repo/db";
import { Public } from "../../common/decorators/public.decorator";
import type { Auction } from "@repo/db";
import type { AuctionWithCreator, AuctionWithCreatorAndBids } from "../../types/prisma";

@Controller("auctions")
export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  @Public()
  @Get()
  async findAll(@Query("status") status?: AuctionStatus): Promise<AuctionWithCreator[]> {
    return this.auctionService.findAll(status);
  }

  @Public()
  @Get(":id")
  async findOne(@Param("id") id: string): Promise<AuctionWithCreatorAndBids> {
    return this.auctionService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@CurrentUser("sub") userId: string, @Body() dto: CreateAuctionDto): Promise<AuctionWithCreator> {
    return this.auctionService.create(userId, dto);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param("id") id: string, @Body() dto: UpdateAuctionDto): Promise<AuctionWithCreator> {
    return this.auctionService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string): Promise<Auction> {
    return this.auctionService.remove(id);
  }
}
