import { IsString, MinLength } from "class-validator";

/** Email or mobile number (bidders can log in with either) */
export class LoginDto {
  @IsString()
  emailOrMobile!: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password!: string;
}
