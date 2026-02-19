import { IsString, IsNumber, Min, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateBidDto {
  @IsString()
  auctionId!: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;

  /** Optional max bid for auto-bid (server may place bids up to this) */
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  maxBid?: number;
}
