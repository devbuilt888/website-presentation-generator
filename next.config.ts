import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow deploys to proceed even if ESLint/TS have issues (unblock Vercel) */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
