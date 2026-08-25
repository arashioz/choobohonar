import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Admin routes stay at /admin, while its generated JS/CSS is namespaced so
  // nginx never serves storefront assets to the admin application.
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "choobohonar.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async rewrites() {
    const api =
      process.env.API_PROXY_TARGET ||
      process.env.API_URL ||
      "http://localhost:3001/api";

    const uploadOrigin = api.replace(/\/api\/?$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${api.replace(/\/$/, "")}/:path*`,
      },
      // Uploaded media is returned as /uploads/<file>; make that URL work
      // while the admin is running on its own development port as well.
      { source: "/uploads/:path*", destination: `${uploadOrigin}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
