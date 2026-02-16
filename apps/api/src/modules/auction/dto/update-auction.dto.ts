import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional } from "class-validator";
import { CreateAuctionDto } from "./create-auction.dto";
import { AuctionStatus } from "@repo/db";

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsEnum(AuctionStatus)
  @IsOptional()
  status?: AuctionStatus;
}
