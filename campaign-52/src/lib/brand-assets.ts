export const brandAssets = {
  logo: {
    white: "/brand/downloads/CHH%20Logos-08.png",
    black: "/brand/downloads/CHH%20Logos-08.png",
  },
} as const;

/** Native asset URLs must stay below the proxied public prefix. */
export function landingPublicPath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/52/") ? path : `/52${path.startsWith("/") ? path : `/${path}`}`;
}
