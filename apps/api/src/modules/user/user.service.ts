import {
  Injectable,
  ConflictException,
  BadRequestException,
  ServiceUnavailableException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../prisma/prisma.service";
import { RegisterDto } from "../auth/dto/register.dto";
import { Role } from "@repo/db";
import type { User } from "@repo/db";
import { UpdateBidderProfileDto } from "./dto/update-bidder-profile.dto";
import { SubmitKycDocumentDto } from "./dto/kyc-document.dto";

/** User shape without sensitive fields; used for isAccountActive/canBid checks */
type UserForChecks = Pick<
  User,
  "emailVerifiedAt" | "mobileVerifiedAt" | "reservationProofVerifiedAt" | "role" | "kycStatus"
>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.client.user.findUnique({ where: { email } });
  }

  async findByMobile(mobile: string) {
    return this.prisma.client.user.findUnique({ where: { mobile } });
  }

  /** Find user by email or mobile (for login) */
  async findByEmailOrMobile(emailOrMobile: string) {
    const trimmed = emailOrMobile.trim();
    if (!trimmed) return null;
    const byEmail = await this.findByEmail(trimmed);
    if (byEmail) return byEmail;
    const byMobile = await this.findByMobile(trimmed);
    return byMobile ?? null;
  }

  async findById(id: string) {
    return this.prisma.client.user.findUnique({
      where: { id },
      include: { kycDocuments: true },
    });
  }

  /** Account can log in after email + mobile + reservation proof verified */
  isAccountActive(user: UserForChecks): boolean {
    return !!(
      user.emailVerifiedAt &&
      user.mobileVerifiedAt &&
      user.reservationProofVerifiedAt
    );
  }

  /** Bidding allowed when account active and KYC approved */
  canBid(user: UserForChecks): boolean {
    return this.isAccountActive(user) && user.kycStatus === "APPROVED";
  }

  async create(dto: RegisterDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException("Email already registered");
    if (dto.mobile) {
      const existingMobile = await this.findByMobile(dto.mobile);
      if (existingMobile) throw new ConflictException("Mobile number already registered");
    }

    const role = dto.role ?? Role.BIDDER;
    const now = new Date();
    const compliance =
      role === Role.BIDDER &&
      dto.acceptTerms &&
      dto.acceptPrivacy &&
      dto.acceptAuctionRules &&
      dto.acceptAsIsDisclaimer
        ? {
            termsAcceptedAt: now,
            privacyAcceptedAt: now,
            auctionRulesAcceptedAt: now,
            asIsDisclaimerAcceptedAt: now,
          }
        : {};

    if (role === Role.BIDDER) {
      if (!dto.fullName?.trim()) throw new BadRequestException("Full name is required for bidder registration");
      if (!dto.mobile?.trim()) throw new BadRequestException("Mobile number is required for bidder registration");
      if (!(dto.acceptTerms && dto.acceptPrivacy && dto.acceptAuctionRules && dto.acceptAsIsDisclaimer)) {
        throw new BadRequestException(
          "Bidder registration requires accepting Terms, Privacy, Auction Rules, and As-Is Disclaimer"
        );
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      return await this.prisma.client.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name ?? dto.fullName ?? undefined,
          fullName: dto.fullName ?? dto.name ?? undefined,
          mobile: dto.mobile ?? undefined,
          role,
          ...compliance,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/Unknown column|does not exist|Argument.*is not valid/i.test(msg)) {
        throw new ServiceUnavailableException(
          "Database schema is out of date. Run: pnpm db:generate && pnpm db:migrate"
        );
      }
      throw err;
    }
  }

  async updateBidderProfile(userId: string, dto: UpdateBidderProfileDto) {
    return this.prisma.client.user.update({
      where: { id: userId },
      data: {
        physicalAddress: dto.physicalAddress,
        preferredPaymentMethod: dto.preferredPaymentMethod,
        companyDetails: dto.companyDetails,
      },
    });
  }

  async setReservationProof(userId: string, fileUrl: string) {
    return this.prisma.client.user.update({
      where: { id: userId },
      data: {
        reservationProofUrl: fileUrl,
        reservationProofVerifiedAt: new Date(), // Auto-approve on upload; replace with admin review if required
      },
    });
  }

  async setReservationProofVerified(userId: string, verified: boolean) {
    return this.prisma.client.user.update({
      where: { id: userId },
      data: {
        reservationProofVerifiedAt: verified ? new Date() : null,
      },
    });
  }

  async submitKycDocument(userId: string, dto: SubmitKycDocumentDto) {
    await this.prisma.client.kycDocument.upsert({
      where: {
        userId_documentType: { userId, documentType: dto.documentType },
      },
      create: {
        userId,
        documentType: dto.documentType,
        fileUrl: dto.fileUrl,
        status: "SUBMITTED",
      },
      update: { fileUrl: dto.fileUrl, status: "SUBMITTED" },
    });
    return this.prisma.client.user.update({
      where: { id: userId },
      data: { kycStatus: "SUBMITTED" },
    });
  }

  /** Auctions won by this user (ended, user has highest bid) */
  async findWonAuctions(userId: string): Promise<unknown[]> {
    const bids = await this.prisma.client.bid.findMany({
      where: { userId },
      include: { auction: { include: { yard: true } } },
    });
    const won = bids.filter(
      (b) => b.auction.status === "ENDED" && Number(b.auction.currentPrice) === Number(b.amount)
    );
    return won.map((b) => b.auction);
  }

  /** Invoices for this user */
  async findInvoices(userId: string): Promise<unknown[]> {
    return this.prisma.client.invoice.findMany({
      where: { userId },
      include: { auction: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  /** Get all bidders for admin */
  async getBidders(options: {
    page: number;
    limit: number;
    status?: string;
    kycStatus?: string;
    search?: string;
  }) {
    const { page, limit, status, kycStatus, search } = options;
    const skip = (page - 1) * limit;

    const where: any = {
      role: "BIDDER"
    };

    if (status) {
      where.emailVerifiedAt = status === "active" ? { not: null } : 
                             status === "inactive" ? null : undefined;
      where.mobileVerifiedAt = status === "active" ? { not: null } : 
                              status === "inactive" ? null : undefined;
      where.reservationProofVerifiedAt = status === "active" ? { not: null } : 
                                        status === "inactive" ? null : undefined;
    }

    if (kycStatus) {
      where.kycStatus = kycStatus;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } }
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.client.user.findMany({
        where,
        skip,
        take: limit,
        include: {
          kycDocuments: {
            select: {
              id: true,
              documentType: true,
              fileUrl: true,
              status: true,
              rejectionReason: true,
              reviewedAt: true
            }
          },
          _count: {
            select: {
              bids: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.client.user.count({ where })
    ]);

    const transformedUsers = users.map(user => {
      const { passwordHash: _, ...userWithoutPassword } = user;
      const isActive = this.isAccountActive(userWithoutPassword);
      const canBid = this.canBid(userWithoutPassword);
      
      return {
        ...userWithoutPassword,
        status: isActive ? "active" : "inactive",
        canBid,
        totalBids: user._count.bids
      };
    });

    return {
      data: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
