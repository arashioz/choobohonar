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
};

export default nextConfig;
