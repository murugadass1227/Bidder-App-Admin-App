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

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException("Invalid email or password");
    return this.buildTokens(user.id, user.email, user.role);
  }

  async register(dto: RegisterDto) {
    const user = await this.userService.create(dto);
    const { passwordHash: _, ...rest } = user;
    return this.buildTokens(rest.id, rest.email, rest.role);
  }

  async refresh(userId: string, jti?: string) {
    if (jti && (await this.isBlacklisted(jti))) {
      throw new UnauthorizedException("Token has been revoked");
    }
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException("User not found");
    const { passwordHash: _, ...rest } = user;
    return this.buildTokens(rest.id, rest.email, rest.role);
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
