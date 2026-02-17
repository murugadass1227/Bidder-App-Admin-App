import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateBidderProfileDto } from "./dto/update-bidder-profile.dto";
import { UploadReservationProofDto } from "./dto/reservation-proof.dto";
import { SubmitKycDocumentDto } from "./dto/kyc-document.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  async me(@CurrentUser("sub") userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) return null;
    const { passwordHash: _, kycDocuments, ...rest } = user;
    const isActive = this.userService.isAccountActive(rest);
    const canBid = this.userService.canBid(rest);
    return {
      ...rest,
      kycDocuments,
      requiresVerification: !isActive,
      canBid,
    };
  }

  @Patch("me")
  async updateProfile(
    @CurrentUser("sub") userId: string,
    @Body() dto: UpdateBidderProfileDto
  ) {
    const user = await this.userService.updateBidderProfile(userId, dto);
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  @Post("me/reservation-proof")
  async uploadReservationProof(
    @CurrentUser("sub") userId: string,
    @Body() dto: UploadReservationProofDto
  ) {
    const user = await this.userService.setReservationProof(userId, dto.fileUrl);
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  @Post("me/kyc")
  async submitKycDocument(
    @CurrentUser("sub") userId: string,
    @Body() dto: SubmitKycDocumentDto
  ) {
    await this.userService.submitKycDocument(userId, dto);
    const user = await this.userService.findById(userId);
    if (!user) return null;
    const { passwordHash: _, ...rest } = user;
    return rest;
  }

  @Get("me/won")
  async wonLots(@CurrentUser("sub") userId: string): Promise<unknown[]> {
    return this.userService.findWonAuctions(userId);
  }

  @Get("me/invoices")
  async myInvoices(@CurrentUser("sub") userId: string): Promise<unknown[]> {
    return this.userService.findInvoices(userId);
  }
}
