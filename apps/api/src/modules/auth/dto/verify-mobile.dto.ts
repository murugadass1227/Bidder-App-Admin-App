import { IsString, IsNotEmpty, Matches } from "class-validator";

export class VerifyMobileDto {
  /** OTP code sent to mobile (e.g. 6 digits) */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{4,8}$/, { message: "Invalid OTP format" })
  code!: string;
}
