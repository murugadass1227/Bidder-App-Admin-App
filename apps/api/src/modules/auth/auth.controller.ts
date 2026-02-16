import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Public } from "../../common/decorators/public.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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
