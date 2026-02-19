import { Injectable, BadRequestException } from "@nestjs/common";
import { randomInt, randomUUID } from "crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { VerificationCodeType } from "@repo/db";

const OTP_EXPIRY_MINUTES = 15;
const CODE_LENGTH = 6;

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  private expiresAt() {
    const d = new Date();
    d.setMinutes(d.getMinutes() + OTP_EXPIRY_MINUTES);
    return d;
  }

  /** Generate and store email verification code (OTP or link token). Optionally send email (stub). */
  async sendEmailVerification(userId: string, type: VerificationCodeType = "EMAIL_OTP") {
    const code = type === "EMAIL_OTP" ? randomInt(10 ** (CODE_LENGTH - 1), 10 ** CODE_LENGTH).toString() : randomUUID();
    await this.prisma.client.verificationCode.create({
      data: {
        userId,
        type,
        code,
        expiresAt: this.expiresAt(),
      },
    });
    // TODO: Send email with code/link (e.g. SendGrid, Resend). For now we rely on admin or manual check.
    return { sent: true, expiresInMinutes: OTP_EXPIRY_MINUTES };
  }

  /** Generate and store mobile OTP. Optionally send SMS/WhatsApp (stub). */
  async sendMobileOtp(userId: string) {
    const code = randomInt(10 ** (CODE_LENGTH - 1), 10 ** CODE_LENGTH).toString();
    await this.prisma.client.verificationCode.create({
      data: {
        userId,
        type: "MOBILE_OTP",
        code,
        expiresAt: this.expiresAt(),
      },
    });
    // TODO: Send SMS/WhatsApp. For now return code in dev only or omit.
    return { sent: true, expiresInMinutes: OTP_EXPIRY_MINUTES };
  }

  /** Verify email code and set emailVerifiedAt */
  async verifyEmail(userId: string, code: string) {
    const record = await this.prisma.client.verificationCode.findFirst({
      where: { userId, type: { in: ["EMAIL_OTP", "EMAIL_LINK"] }, code },
      orderBy: { createdAt: "desc" },
    });
    if (!record) throw new BadRequestException("Invalid or expired verification code");
    if (record.expiresAt < new Date()) throw new BadRequestException("Verification code has expired");

    await this.prisma.client.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });
    await this.prisma.client.verificationCode.deleteMany({ where: { userId, type: record.type } });
    return { verified: true };
  }

  /** Verify mobile OTP and set mobileVerifiedAt */
  async verifyMobile(userId: string, code: string) {
    const record = await this.prisma.client.verificationCode.findFirst({
      where: { userId, type: "MOBILE_OTP", code },
      orderBy: { createdAt: "desc" },
    });
    if (!record) throw new BadRequestException("Invalid or expired OTP");
    if (record.expiresAt < new Date()) throw new BadRequestException("OTP has expired");

    await this.prisma.client.user.update({
      where: { id: userId },
      data: { mobileVerifiedAt: new Date() },
    });
    await this.prisma.client.verificationCode.deleteMany({ where: { userId, type: "MOBILE_OTP" } });
    return { verified: true };
  }
}
