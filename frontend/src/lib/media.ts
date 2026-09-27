/**
 * Uploaded media is stored in the backend volume and served by nginx at
 * /uploads. Next's image optimizer runs inside the frontend container, where
 * that volume does not exist, so these same-origin URLs must bypass optimizer.
 */
export function isUploadedMedia(source: string | undefined | null): boolean {
  if (!source) return false;
  try {
    return new URL(source, "http://local.invalid").pathname.startsWith("/uploads/");
  } catch {
    return source.startsWith("/uploads/");
  }
}

const OPTIMIZED_HOSTS = new Set(["choobohonar.com", "www.choobohonar.com", "picsum.photos"]);

/** Next's optimizer only allows configured remote hosts and cannot read /uploads. */
export function shouldUnoptimizeImage(source: string | undefined | null): boolean {
  if (!source) return true;
  if (isUploadedMedia(source)) return true;
  if (source.startsWith("/")) return false;
  try {
    return !OPTIMIZED_HOSTS.has(new URL(source).hostname);
  } catch {
    return true;
  }
}

