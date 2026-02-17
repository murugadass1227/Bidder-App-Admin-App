import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { env } from "../../config/env.config";
import { PrismaService } from "../../prisma/prisma.service";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./dto/jwt-payload.interface";
import { Role } from "@repo/db";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  /** Validate by email or mobile + password (for bidder login) */
  async validateUserByEmailOrMobile(emailOrMobile: string, password: string) {
    const user = await this.userService.findByEmailOrMobile(emailOrMobile);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUserByEmailOrMobile(dto.emailOrMobile, dto.password);
    if (!user) throw new UnauthorizedException("Invalid email/mobile or password");
    const tokens = this.buildTokens(user.id, user.email, user.role);
    const isBidder = user.role === Role.BIDDER;
    const requiresVerification =
      isBidder && !this.userService.isAccountActive(user as Parameters<typeof this.userService.isAccountActive>[0]);
    return { ...tokens, requiresVerification: !!requiresVerification };
  }

  async register(dto: RegisterDto) {
    const user = await this.userService.create(dto);
    const { passwordHash: _, ...rest } = user;
    const tokens = this.buildTokens(rest.id, rest.email, rest.role);
    const isBidder = rest.role === Role.BIDDER;
    const requiresVerification =
      isBidder && !this.userService.isAccountActive(user as Parameters<typeof this.userService.isAccountActive>[0]);
    return { ...tokens, requiresVerification: !!requiresVerification };
  }

  async refresh(userId: string, jti?: string) {
    if (jti && (await this.isBlacklisted(jti))) {
      throw new UnauthorizedException("Token has been revoked");
    }
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException("User not found");
    const { passwordHash: _, kycDocuments: __, ...rest } = user;
    const tokens = this.buildTokens(rest.id, rest.email, rest.role);
    const isBidder = rest.role === Role.BIDDER;
    const requiresVerification =
      isBidder && !this.userService.isAccountActive(rest as Parameters<typeof this.userService.isAccountActive>[0]);
    return { ...tokens, requiresVerification: !!requiresVerification };
  }

  async blacklistRefreshToken(jti: string, expiresAt: Date) {
    await this.prisma.client.refreshTokenBlacklist.create({
      data: { jti, expiresAt },
    });
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const entry = await this.prisma.client.refreshTokenBlacklist.findUnique({
      where: { jti },
    });
    return !!entry;
  }

  private buildTokens(sub: string, email: string, role: string) {
    const payload: JwtPayload = { sub, email, role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshPayload = { ...payload, type: "refresh" as const, jti: randomUUID() };
    const refreshToken = this.jwtService.sign(
      refreshPayload,
      { secret: env.JWT_REFRESH_SECRET, expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );
    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      user: { id: sub, email, role },
    };
  }
}
