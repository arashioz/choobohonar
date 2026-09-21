import type { NextConfig } from "next";

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep the standalone server inside this app directory. The repository also
  // has a lockfile in its parent workspace, which can otherwise make Next.js
  // trace from the wrong root and leave Docker without server.js.
  outputFileTracingRoot: __dirname,
  // The app directory already owns `/admin/*` routes. Only namespace its
  // generated assets, so nginx never serves storefront assets to the admin.
  assetPrefix,
  // API clients must not be redirected from POST /api/... to /api/.../;
  // redirects can turn the request into a route that does not exist.
  trailingSlash: false,
  experimental: {
    serverActions: { bodySizeLimit: "500mb" },
    middlewareClientMaxBodySize: "500mb",
    proxyClientMaxBodySize: "500mb",
  },
  images: {

    // Image optimization does not automatically inherit assetPrefix. Keep it
    // below /admin so nginx sends brandbook images to the admin Next server.
    path: assetPrefix ? `${assetPrefix}/_next/image` : "/_next/image",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "choobohonar.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async rewrites() {
    // In production nginx owns the /api routing. Keeping this rewrite in the
    // standalone build would bake a build-time value (often localhost:3001)
    // into Next and make the admin container proxy to itself. The CMS route
    // handlers use API_URL at request time, so they can reach backend:3001.
    if (process.env.NODE_ENV === "production") return [];

    const api =
      process.env.API_PROXY_TARGET ||
      process.env.API_URL ||
      "http://localhost:3001/api";

    const uploadOrigin = api.replace(/\/api\/?$/, "");
    return [
      // App Route Handlers under /api already attach the admin JWT and proxy
      // to the right Nest paths. A catch-all rewrite would steal /api/cms/:id
      // and hit the public CMS, which looks up slugs and returns
      // "Published entry not found".
      { source: "/uploads/:path*", destination: `${uploadOrigin}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
