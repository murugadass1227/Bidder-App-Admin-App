import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsIn,
  IsBoolean,
  Matches,
  MaxLength,
} from "class-validator";
import { Role } from "@repo/db";

// Self-registration only allows BIDDER or ADMIN; SALVAGE_YARD_OPERATOR and INSURER_ASSESSOR are assigned by admin.
const REGISTRATION_ALLOWED_ROLES: Role[] = [Role.BIDDER, Role.ADMIN];

// E.164-like: optional +, digits, typically 10–15 digits
const MOBILE_REGEX = /^\+?[0-9]{10,15}$/;

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;

  /** Full name (required for bidder registration) */
  @IsString()
  @IsOptional()
  @MaxLength(200)
  fullName?: string;

  /** Mobile number (required for bidder; used for OTP verification) */
  @IsString()
  @IsOptional()
  @Matches(MOBILE_REGEX, { message: "Invalid mobile number format" })
  mobile?: string;

  @IsEnum(Role)
  @IsIn(REGISTRATION_ALLOWED_ROLES, { message: "Only BIDDER or ADMIN can self-register" })
  @IsOptional()
  role?: Role;

  /** Compliance: Terms & Conditions (required for bidder) */
  @IsBoolean()
  @IsOptional()
  acceptTerms?: boolean;

  @IsBoolean()
  @IsOptional()
  acceptPrivacy?: boolean;

  @IsBoolean()
  @IsOptional()
  acceptAuctionRules?: boolean;

  @IsBoolean()
  @IsOptional()
  acceptAsIsDisclaimer?: boolean;
}
