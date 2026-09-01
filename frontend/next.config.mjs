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
    const finishDestinations = {
      walnut: "/materials/wood/american-walnut",
      natural: "/materials/wood/natural-oak",
      mahogany: "/materials/wood",
      hazelnut: "/materials/wood",
      beige: "/materials/wood",
    };
    const legacyArticleRedirects = {
      "choosing-the-right-sofa": "sofa-selection-living-room-guide",
      "bedroom-set-guide": "bedroom-set-selection-guide",
      "dining-furniture-guide": "dining-table-size-and-layout-guide",
      "wood-finish-care": "furniture-care-by-material-guide",
      "furniture-seasonal-care": "furniture-care-by-material-guide",
      "solid-wood-materials": "wood-and-veneer-furniture-material-guide",
      "fabric-materials-guide": "upholstery-fabric-selection-guide",
      "joinery-fundamentals": "sofa-construction-quality-checklist",
      "space-measurement-guide": "small-living-room-sofa-layout",
      "minimalist-interior-style": "coordinating-sofa-dining-and-materials",
      "small-living-room-ideas": "small-living-room-sofa-layout",
      "color-palette-home": "coordinating-sofa-dining-and-materials",
      "behind-the-craft": "residential-interior-project-from-plan-to-detail",
      "wood-humidity-science": "wood-and-veneer-furniture-material-guide",
    };

    return [
      {
        source: "/location",
        destination: "/stores",
        permanent: true,
      },
      {
        source: "/location/:path*",
        destination: "/stores",
        permanent: true,
      },
      ...Object.entries(finishDestinations).flatMap(([id, destination]) => [
        {
          source: `/collection/${id}`,
          destination,
          permanent: true,
        },
        {
          source: `/materials/wood/${id}`,
          destination,
          permanent: true,
        },
      ]),
      ...Object.entries(legacyArticleRedirects).map(([source, destination]) => ({
        source: `/magazine/${source}`,
        destination: `/magazine/${destination}`,
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    // The image optimizer runs inside the frontend container. Unlike browser
    // requests, it cannot use nginx's /uploads location, so proxy uploads to
    // the backend service from both development and production.
    const api = process.env.API_PROXY_TARGET || process.env.API_URL || "http://localhost:3001/api";
    const uploadsRewrite = {
      source: "/uploads/:path*",
      destination: `${api.replace(/\/api\/?$/, "")}/uploads/:path*`,
    };

    if (process.env.NODE_ENV === "production") return [uploadsRewrite];

    return [
      {
        source: "/api/:path*",
        destination: `${api.replace(/\/$/, "")}/:path*`,
      },
      uploadsRewrite,
    ];
  },
};

export default nextConfig;
