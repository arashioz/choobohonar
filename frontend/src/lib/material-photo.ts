/** Swatch served from the admin uploads volume. Local /images files are not used. */
export const MATERIAL_PLACEHOLDER = "/uploads/material-placeholder.png";

export function adminMaterialPhoto(...sources: (string | undefined)[]) {
  for (const source of sources) {
    const value = (source || "").trim();
    if (value.startsWith("/uploads/") && !value.startsWith("/uploads/products/")) return value;
  }
  return MATERIAL_PLACEHOLDER;
}
