/** Admin uploads, or a static wood swatch served from the storefront. */
export const MATERIAL_PLACEHOLDER = "/uploads/material-placeholder.png";

export function adminMaterialPhoto(...sources: (string | undefined)[]) {
  for (const source of sources) {
    const value = (source || "").trim();
    if (value.startsWith("/images/materials/")) return value;
    if (value.startsWith("/uploads/") && !value.startsWith("/uploads/products/")) return value;
  }
  return MATERIAL_PLACEHOLDER;
}
