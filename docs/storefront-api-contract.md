# Storefront v2 — Frontend/Backend Contract

این سند قرارداد فاز فروشگاه جدید است. فرانت‌اند فعلاً از snapshot عمومی WooCommerce و adapter محلی استفاده می‌کند؛ بک‌اند باید بدون تغییر در UI، همین shape را از مسیر `/api/catalog` ارائه کند.

## Route map

| Frontend route | Purpose |
| --- | --- |
| `/products` | Editorial commerce landing |
| `/products/category/[...slug]` | Product category and nested subcategory |
| `/products/[slug]` | Product detail page |
| `/cart` | Persistent client cart and order summary |
| `/checkout` | Customer/account, delivery, review and order handoff |
| `/materials` | Material library landing |
| `/materials/[category]` | Material category |
| `/materials/[category]/[slug]` | Material detail / sample page |

## Catalog endpoints

### `GET /api/catalog/categories`

Query:

- `kind=product|material`
- `parent=<slug>` optional

Response:

```ts
type CatalogCategory = {
  id: string;
  slug: string;
  label: string;
  description: string;
  parentSlug: string | null;
  productCount: number;
  image: MediaAsset | null;
  children: CatalogCategory[];
};
```

### `GET /api/catalog/products`

Query:

- `category=<slug>`
- `q=<search term>`
- `type=<product category label>`
- `collection=<collection slug>`
- `stock=1`
- `sort=featured|newest|popular|price-asc|price-desc`
- `page=1`
- `perPage=18`
- facet values as `filter[<taxonomy>]=<slug>`

Response:

```ts
type CatalogListResponse = {
  items: CatalogProductCard[];
  pagination: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  facets: CatalogFacet[];
  appliedFilters: Record<string, string[]>;
};

type CatalogFacet = {
  id: string;
  label: string;
  display: "list" | "swatch" | "range" | "toggle";
  options: {
    id: string;
    label: string;
    count: number;
    color?: string;
    image?: MediaAsset;
  }[];
};
```

Facets must be category-aware. For example, sofa can return collection, fabric, wood, size and availability; carpet can return weave, dimensions and color. The frontend must not receive every WooCommerce attribute for every category.

### `GET /api/catalog/products/:slug`

```ts
type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: TaxonomyTerm;
  categories: TaxonomyTerm[];
  collection?: TaxonomyTerm;
  description: string;
  shortDescription: string;
  media: MediaAsset[];
  price: Money | null;
  priceRange?: { min: Money; max: Money };
  stock: "in-stock" | "preorder" | "out-of-stock";
  purchasable: boolean;
  leadTime?: string;
  warranty?: string;
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  specifications: { label: string; value: string }[];
  relatedProductSlugs: string[];
  seo: SeoFields;
};
```

Variant selection must be resolvable using a stable combination of taxonomy/value slugs. Price and stock belong to the selected variant when a variant exists.

## Material endpoints

### `GET /api/catalog/materials`

Accepts `category`, `q`, `commerceMode`, `color`, `application`, `page`, and `perPage`.

### `GET /api/catalog/materials/:slug`

```ts
type MaterialProduct = {
  id: string;
  slug: string;
  category: "wood" | "fabric" | "veneer" | "metal" | string;
  name: string;
  code: string;
  subtitle: string;
  description: string;
  swatch: { color: string; accent?: string; image?: MediaAsset };
  applicationMedia: MediaAsset[];
  commerceMode: "direct" | "quote" | "sample";
  unit: string;
  price: Money | null;
  specifications: { label: string; value: string }[];
  uses: string[];
  care: string;
  relatedMaterialSlugs: string[];
  relatedProductSlugs: string[];
};
```

## Search, campaigns and stories

### `GET /api/search/suggestions?q=<term>&scope=<category slug>`

Returns a maximum of 8 product/category suggestions. A category scope is optional.

### `GET /api/campaigns?placement=<placement>&category=<slug>`

Supported placements:

- `shop-home-hero`
- `shop-home-inline`
- `category-grid`
- `product-editorial`
- `materials-home`

```ts
type Campaign = {
  id: string;
  placement: string;
  position?: number;
  categorySlugs: string[];
  title: string;
  body?: string;
  desktopMedia: MediaAsset;
  mobileMedia?: MediaAsset;
  cta?: { label: string; href: string };
  startsAt?: string;
  endsAt?: string;
};
```

### `GET /api/media-stories?placement=shop-home`

```ts
type MediaStory = {
  id: string;
  label: string;
  title: string;
  poster: MediaAsset;
  video: MediaAsset;
  productSlugs: string[];
  order: number;
};
```

Video should provide a vertical rendition, a poster, duration and captions when spoken content exists.

## Cart, customer and checkout endpoints

The frontend currently keeps a versioned cart snapshot in local storage so the full UX can be reviewed before backend integration. The backend must become the source of truth for price, stock, promotions and variant validity before an order is created.

### `POST /api/cart/validate`

Request:

```ts
type CartValidationRequest = {
  items: {
    productId: string;
    quantity: number;
    selectedOptions: { taxonomy: string; value: string }[]; // stable taxonomy/value slugs
  }[];
};
```

Response returns validated line items, authoritative unit prices, stock state, lead time, discount lines and a signed `cartToken`. Client-provided totals must never be trusted.

### `POST /api/customers/register`

Creates an optional account during checkout. Minimum fields are `fullName`, `phone`, `email`, and `password`. Phone/email uniqueness, password policy and OTP requirements are backend-owned.

### `POST /api/orders`

```ts
type CreateOrderRequest = {
  cartToken: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    createAccount: boolean;
    password?: string;
  };
  delivery: {
    province: string;
    city: string;
    address: string;
    postalCode: string;
    note?: string;
  };
  paymentMethod: "online" | "coordination";
  acceptedTermsVersion: string;
  idempotencyKey: string;
};

type CreateOrderResponse = {
  orderId: string;
  orderNumber: string;
  status: "pending-payment" | "pending-review";
  totals: {
    items: Money;
    shipping: Money;
    discount: Money;
    payable: Money;
  };
  payment?: { redirectUrl: string; expiresAt: string };
};
```

The endpoint must be idempotent. For online payment, the frontend redirects only to the `payment.redirectUrl` returned by the backend. Payment callback verification and final order status are server responsibilities.

## Shared primitives

```ts
type Money = {
  amount: string;
  currency: "IRT" | string;
  formatted: string;
};

type MediaAsset = {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  mimeType: string;
};

type TaxonomyTerm = {
  id: string;
  slug: string;
  label: string;
};

type SeoFields = {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
};
```

## Current integration boundary

Cart persistence, quantity management, customer/account form, delivery form, order review and the completion state are implemented in the frontend. The current completion action is explicitly marked `frontend-preview`, stores no contact/address data, and does not claim a real payment or backend order. Real registration, cart validation, order persistence, shipping calculation, payment and order tracking require the endpoints above.
