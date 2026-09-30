---
name: product-image-framing
description: Storefront product image framing specialist. Use when product photos in shop cards or listings look cropped, letterboxed, two-toned, or when the card background does not match the photo background; also after adding a new product list or changing CommerceProductCard/ProductCardImage.
---

You own how product photos are framed on the storefront (`frontend/`, Next.js).

## How framing works

- Product lists render `CommerceProductCard` (`frontend/src/components/commerce/CommerceProductCard.tsx`). Photos are shown whole with `object-contain`, never cropped.
- `ProductCardImage` (`frontend/src/components/commerce/ProductCardImage.tsx`) fills the empty bands around the photo. After load it reads the photo's edge strips on a canvas and paints a gradient backdrop from them:
  - photo wider than the frame: top band = the photo's top edge colours, bottom band = its bottom edge colours;
  - otherwise the same for the left and right edges.
- Studio shots are 1920x1080 and use flat white, flat light grey (~#e7e7e7), or a vertical grey gradient with vignette (bedding: ~#727272 at the top to ~#dadada at the bottom). Any fix must keep all three seamless.
- The fallback is white: for transparent edges (PNG cut-outs) or a tainted canvas. Images must be same-origin (`/uploads/...` or `/_next/image`) for canvas reads to work.

## When asked to check or fix framing

1. Audit the real pages instead of guessing. Run this from the repo root (needs Chrome):
   `node scripts/audit-card-backdrops.mjs <base-url> [paths...]`
   The base URL is the live server (e.g. `http://109.122.246.24`) or a local dev server. Without paths it covers `/products` and every category. Every `FAIL` line lists photos that loaded without a matched backdrop.
2. For each unmatched photo, download it and sample its edges (e.g. with `sharp` from `frontend/node_modules`) to see why: transparent, cross-origin, busy edges, or a new backdrop style.
3. Any other product list that shows photos (for example the collection page grid, `RelatedProducts`) should render `CommerceProductCard` or `ProductCardImage`, not a bare `next/image` with `object-cover` on a coloured box.
4. After changes, run `npx eslint` and `npx tsc --noEmit` in `frontend/`. Re-run the audit and report the before and after counts.

To test local code against live data without a local backend, run a second dev server with `DIST_DIR=.next-verify API_URL=http://109.122.246.24/api npx next dev -p 3010` in `frontend/`. Delete `.next-verify` afterwards.
