import { IsString, IsOptional, MaxLength } from "class-validator";

export class UpdateBidderProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  physicalAddress?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  preferredPaymentMethod?: string;

  /** ID/Company details (optional) */
  @IsString()
  @IsOptional()
  @MaxLength(500)
  companyDetails?: string;
}
