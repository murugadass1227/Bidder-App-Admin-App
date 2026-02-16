import { IsString, IsOptional, IsNumber, IsEnum, Min } from "class-validator";
import { Type } from "class-transformer";
import { AuctionStatus } from "@repo/db";

export class CreateAuctionDto {
  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  startPrice!: number;

  @IsEnum(AuctionStatus)
  @IsOptional()
  status?: AuctionStatus;

  @IsOptional()
  @Type(() => Date)
  startsAt?: Date;

  @IsOptional()
  @Type(() => Date)
  endsAt?: Date;
}
