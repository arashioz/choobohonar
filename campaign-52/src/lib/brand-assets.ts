export const brandAssets = {
  logo: {
    white: "/brand/downloads/CHH-Logos-04-white.svg",
    black: "/brand/downloads/CHH-Logos-04.svg",
  },
} as const;

/**
 * Native <img>, <video>, favicon and metadata URLs do not receive Next's
 * basePath automatically. The campaign is mounted at /landing in production.
 */
export function landingPublicPath(path: string): string {
  return path.startsWith("/landing/") ? path : `/landing${path.startsWith("/") ? path : `/${path}`}`;
}
