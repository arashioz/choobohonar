import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Always proxy /api when API_PROXY_TARGET is set (Docker).
    const api = process.env.API_PROXY_TARGET;
    if (!api) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${api.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
