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

