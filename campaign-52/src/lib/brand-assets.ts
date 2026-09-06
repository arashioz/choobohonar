export const brandAssets = {
  monogram: {
    white: "/brand/downloads/choobohonar-monogram-white.svg",
    black: "/brand/downloads/choobohonar-monogram-black.svg",
  },
  wordmarkFa: {
    white: "/brand/downloads/choobohonar-wordmark-persian-white.svg",
    black: "/brand/downloads/choobohonar-wordmark-persian-black.svg",
  },
  lockupFa: {
    white: "/brand/downloads/choobohonar-lockup-persian-white.svg",
    black: "/brand/downloads/choobohonar-lockup-persian-black.svg",
  },
  sloganFa: "/brand/downloads/choobohonar-slogan-fa.svg",
} as const;

/**
 * Native <img>, <video>, favicon and metadata URLs do not receive Next's
 * basePath automatically. The campaign is mounted at /landing in production.
 */
export function landingPublicPath(path: string): string {
  return path.startsWith("/landing/") ? path : `/landing${path.startsWith("/") ? path : `/${path}`}`;
}
