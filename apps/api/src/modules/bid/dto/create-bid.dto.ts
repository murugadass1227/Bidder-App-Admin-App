import { IsString, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateBidDto {
  @IsString()
  auctionId!: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;
}
