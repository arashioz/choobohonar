export const brandAssets = {
  logo: {
    white: "/brand/downloads/CHH-Logos-04-white.svg",
    black: "/brand/downloads/CHH-Logos-04.svg",
  },
} as const;

/** Public brand files are served by the main site at the root /brand path. */
export function landingPublicPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
