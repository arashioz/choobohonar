import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // This application is mounted by the main reverse proxy at /landing.
  // Next applies this prefix to routes, links and generated _next assets.
  basePath: "/landing",
  outputFileTracingRoot: dir,
  poweredByHeader: false,
  serverExternalPackages: ["gsap"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  async headers() {
    const immutableAssets = ["fonts", "brand", "images", "videos"];
    return [
      ...immutableAssets.map((directory) => ({
        source: `/${directory}/:path*`,
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      })),
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
    ];
  },
};

export default nextConfig;
