export function resolveCollectionCover(input: {
  coverMode?: unknown;
  image?: unknown;
  cmsCover?: unknown;
  productImage?: unknown;
}): string {
  const cmsCover = text(input.cmsCover);
  if (cmsCover) return cmsCover;
  const image = text(input.image);
  if (input.coverMode === 'custom' && image) return image;
  return text(input.productImage) || image;
}

export function readCmsCover(entry?: {
  data?: unknown;
} | null): string {
  const data =
    entry?.data && typeof entry.data === 'object' && !Array.isArray(entry.data)
      ? (entry.data as Record<string, unknown>)
      : {};
  return text(data.coverImage);
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}
