export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type?: "access" | "refresh";
  jti?: string;
  iat?: number;
  exp?: number;
}
