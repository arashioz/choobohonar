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
};

export default nextConfig;
