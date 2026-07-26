/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.DIST_DIR || ".next",
  experimental: {
    serverComponentsExternalPackages: ["gsap"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "choobohonar.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async redirects() {
    const finishIds = ["walnut", "mahogany", "natural", "hazelnut", "beige"];
    return finishIds.map((id) => ({
      source: `/collection/${id}`,
      destination: `/materials/wood/${id}`,
      permanent: true,
    }));
  },
  async rewrites() {
    // Only in local/dev. In production nginx already proxies /api → backend.
    if (process.env.NODE_ENV === "production") return [];

    const api =
      process.env.API_PROXY_TARGET || "http://localhost:3001/api";
    return [
      {
        source: "/api/:path*",
        destination: `${api.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
