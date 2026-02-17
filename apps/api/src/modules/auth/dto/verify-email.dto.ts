import { IsString, IsNotEmpty } from "class-validator";

export class VerifyEmailDto {
  /** Verification code or token sent to email */
  @IsString()
  @IsNotEmpty()
  code!: string;
}
