import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL: "https://imagedistortion.shop",
    NEXTAUTH_SECRET: "development-secret-change-in-production",
  },
};

export default nextConfig;
