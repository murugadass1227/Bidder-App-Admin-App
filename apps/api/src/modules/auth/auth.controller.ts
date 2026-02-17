import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { VerificationService } from "./verification.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { VerifyMobileDto } from "./dto/verify-mobile.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private verificationService: VerificationService
  ) {}

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("verify-email")
  async verifyEmail(@Body() dto: VerifyEmailDto, @CurrentUser("sub") userId: string) {
    if (!userId) throw new Error("Unauthorized");
    return this.verificationService.verifyEmail(userId, dto.code);
  }

  @Post("verify-mobile")
  async verifyMobile(@Body() dto: VerifyMobileDto, @CurrentUser("sub") userId: string) {
    if (!userId) throw new Error("Unauthorized");
    return this.verificationService.verifyMobile(userId, dto.code);
  }

  @Post("send-verify-email")
  async sendVerifyEmail(@CurrentUser("sub") userId: string) {
    if (!userId) throw new Error("Unauthorized");
    return this.verificationService.sendEmailVerification(userId);
  }

  @Post("send-verify-mobile")
  async sendVerifyMobile(@CurrentUser("sub") userId: string) {
    if (!userId) throw new Error("Unauthorized");
    return this.verificationService.sendMobileOtp(userId);
  }

  @Post("refresh")
  @Public()
  @UseGuards(AuthGuard("jwt-refresh"))
  async refresh(
    @Body() dto: RefreshTokenDto,
    @CurrentUser("sub") sub?: string,
    @CurrentUser("jti") jti?: string
  ) {
    if (!sub) throw new Error("Missing user");
    return this.authService.refresh(sub, jti);
  }

  @Public()
  @Post("logout")
  @UseGuards(AuthGuard("jwt-refresh"))
  async logout(
    @Body() dto: RefreshTokenDto,
    @CurrentUser("sub") sub?: string,
    @CurrentUser("jti") jti?: string,
    @CurrentUser("exp") exp?: number
  ) {
    if (jti && exp) {
      const expiresAt = new Date(exp * 1000);
      await this.authService.blacklistRefreshToken(jti, expiresAt);
    }
    return { message: "Logged out" };
  }
}
