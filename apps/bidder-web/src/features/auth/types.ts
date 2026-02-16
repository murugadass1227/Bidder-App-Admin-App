import type { User, AuthTokens } from "@/types/global";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export type { User, AuthTokens };
