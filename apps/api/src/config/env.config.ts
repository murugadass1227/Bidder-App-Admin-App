function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) throw new Error(`Missing required env: ${key}`);
  return value;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === "") return defaultValue;
  const n = Number(raw);
  if (Number.isNaN(n)) throw new Error(`Invalid number for env: ${key}`);
  return n;
}

export const env = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: getEnv("JWT_ACCESS_EXPIRES_IN", "15m"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
  PORT: getEnvNumber("PORT", 4000),
  CORS_ORIGINS: getEnv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001"),
  RATE_LIMIT_TTL: getEnvNumber("RATE_LIMIT_TTL", 60),
  RATE_LIMIT_MAX: getEnvNumber("RATE_LIMIT_MAX", 100),
};
