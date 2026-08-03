/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.DIST_DIR || ".next",
  output: "standalone",
  poweredByHeader: false,
  serverExternalPackages: ["gsap"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
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
  async headers() {
    const immutableAssets = ["fonts", "brand", "images", "videos"];

    return [
      ...immutableAssets.map((directory) => ({
        source: `/${directory}/:path*`,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      })),
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
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
