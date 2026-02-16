import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  reactStrictMode: true,
};

export default nextConfig;
