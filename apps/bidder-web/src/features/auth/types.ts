import type { User, AuthTokens } from "@/types/global";

export interface LoginInput {
  /** Email or mobile number */
  emailOrMobile: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  name?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptAuctionRules: boolean;
  acceptAsIsDisclaimer: boolean;
}

export type { User, AuthTokens };
