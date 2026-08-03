# Storefront v2 — Design and Motion System

## Direction

`Editorial commerce` is the visual direction: large truthful product imagery, generous negative space, restrained controls, and storytelling sections that never compete with price, filters, or purchase actions.

## Core tokens

- `forest #092B1C`: primary brand surface, high-emphasis text and commerce actions
- `paper #F4EFE8`: default reading and catalog surface
- `peach #FBBEA6`: warm highlight, story labels and dark-surface accents
- `brick #9A3110`: accessible text accent and active commerce detail
- `#E8DED2`: secondary catalog/editorial surface

Typography remains Peyda for Persian interface and display copy. Oversized headings use extra-light weight, compressed leading, and tight tracking; transactional text stays regular/medium with comfortable line height.

## Layout rules

- Maximum content width: `1600px`
- Page gutters: `24 / 40 / 64px`
- Product cards default to `4:5`; campaign slots use wide editorial ratios
- Search/sort controls stay sticky; filters become a bottom sheet below desktop
- Material cards split application photography and a physical-looking swatch
- Banner positions are data-driven and do not alter product pagination

## Motion language

Tokens live in `src/lib/motion-tokens.ts` and CSS variables in `globals.css`.

- `fast 240ms`: toggles, chips and immediate feedback
- `base 500ms`: hover fills, drawers and filter transitions
- `reveal 1150ms`: editorial headings and hero media
- `immersive 1400ms`: large imagery and story cards
- primary ease: `cubic-bezier(0.16, 1, 0.3, 1)` / GSAP `power4.out`

GSAP is reserved for scroll and clip reveals. CSS handles hover, focus, filter and drawer feedback. Motion is disabled or reduced through `prefers-reduced-motion` and every reveal has a visibility failsafe.

## Commerce component inventory

- `CommerceProductCard`: reusable product card with price, stock and collection
- `ProductsLanding`: editorial storefront landing and vertical story slots
- `CategoryCatalog`: URL-backed search, sort, facets, mobile filter sheet and campaign injection
- `CommerceProductDetail`: gallery, real Woo attributes, price and purchase handoff
- `CommerceProductEditorial`: dynamic product guidance, technical profile and SEO-visible FAQ
- `CartProvider`: versioned local cart persistence and cross-tab synchronization
- `CartPageClient`: line items, option snapshots, quantity controls and order summary
- `CheckoutFlow`: customer/account, delivery, review and backend-ready completion states
- Header cart control: always-visible bag icon with live quantity badge
- `MaterialCategoryCatalog`: swatch-oriented search and commerce-mode filters
- Material detail route: technical profile, uses, care and sample/quote/direct purchase states
- `ClipReveal`: shared editorial motion primitive

## Content integrity

Product photography is sourced from the live public catalog. Synthetic product imagery is intentionally excluded. Vertical-video cards render real posters now and are ready for CMS-provided video sources through the media-story API contract.
