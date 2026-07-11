import { projects } from "@/data/projects";
import { resolveProjectImage } from "@/lib/project-images";
import { finishes, products, getProductsByFinish } from "@/data/products";

export type GallerySource = "project" | "product" | "collection";

export type GalleryLink = {
  source: GallerySource;
  label: string;
  href: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  primary: GalleryLink;
  related: GalleryLink[];
};

export type GalleryFilter = GallerySource | "all";

const sourcePriority: Record<GallerySource, number> = {
  project: 0,
  product: 1,
  collection: 2,
};

function isGalleryImage(src: string) {
  return src.startsWith("/images/");
}

export const sourceLabels: Record<GallerySource, string> = {
  project: "\u067e\u0631\u0648\u0698\u0647",
  product: "\u0645\u062d\u0635\u0648\u0644",
  collection: "\u06a9\u0627\u0644\u06a9\u0634\u0646",
};

function addLink(map: Map<string, GalleryLink[]>, src: string, link: GalleryLink) {
  const list = map.get(src) ?? [];
  if (!list.some((l) => l.href === link.href)) list.push(link);
  map.set(src, list);
}

function buildLinkMap(): Map<string, GalleryLink[]> {
  const map = new Map<string, GalleryLink[]>();

  for (const project of projects) {
    const link: GalleryLink = {
      source: "project",
      label: project.title,
      href: `/projects/${project.slug}`,
    };
    addLink(map, project.image, link);
    project.gallery.forEach((img) => addLink(map, resolveProjectImage(img).src, link));
    project.sections.forEach((section) => {
      if (section.image) addLink(map, section.image, link);
    });
    project.featuredImages?.forEach((src) => addLink(map, src, link));
  }

  for (const product of products) {
    const link: GalleryLink = {
      source: "product",
      label: product.name,
      href: `/products/${product.slug}`,
    };
    addLink(map, product.image, link);
    product.gallery.forEach((src) => addLink(map, src, link));
  }

  for (const finish of finishes) {
    const link: GalleryLink = {
      source: "collection",
      label: `\u06a9\u0627\u0644\u06a9\u0634\u0646 ${finish.label}`,
      href: `/collection/${finish.id}`,
    };
    getProductsByFinish(finish.id)
      .slice(0, 2)
      .forEach((product) => {
        addLink(map, product.image, link);
        addLink(map, product.image, {
          source: "product",
          label: product.name,
          href: `/products/${product.slug}`,
        });
      });
  }

  return map;
}

function pickPrimary(links: GalleryLink[]): GalleryLink {
  return [...links].sort((a, b) => sourcePriority[a.source] - sourcePriority[b.source])[0];
}

export function buildGalleryItems(): GalleryItem[] {
  const map = buildLinkMap();
  const items: GalleryItem[] = [];
  let i = 0;

  Array.from(map.entries()).forEach(([src, links]) => {
    if (!links.length || !isGalleryImage(src)) return;
    const primary = pickPrimary(links);
    const related = links.filter((l) => l.href !== primary.href);
    items.push({
      id: `${primary.source}-${i}`,
      src,
      alt: primary.label,
      primary,
      related,
    });
    i += 1;
  });

  return items;
}

export function filterGalleryItems(items: GalleryItem[], filter: GalleryFilter): GalleryItem[] {
  if (filter === "all") return items;
  return items.filter(
    (item) => item.primary.source === filter || item.related.some((l) => l.source === filter)
  );
}

export function getGalleryMarqueeItems(items: GalleryItem[], count = 12): GalleryItem[] {
  return items.slice(0, count);
}

export type GalleryRowKind = "pair" | "triple";

export type GalleryCycle = {
  id: string;
  rowKind: GalleryRowKind;
  rowItems: GalleryItem[];
  /** Deterministic random index into rowItems for fullscreen expand. */
  focusIndex: number;
  /** Horizontal rail after pair cycles. */
  railItems: GalleryItem[];
  /** Two extra vertical rows after triple cycles. */
  verticalRows: GalleryItem[][];
};

function pickFocusIndex(cycleId: number, count: number): number {
  if (count <= 1) return 0;
  let s = cycleId * 9301 + 49297;
  s = (s * 16807) % 2147483647;
  return Math.abs(s) % count;
}

/**
 * Each cycle: grid row -> fullscreen (random card from row) -> horizontal rail (pair) or 2 vertical rows (triple).
 */
export function buildGalleryCycles(items: GalleryItem[]): GalleryCycle[] {
  if (!items.length) return [];

  const pool = seededShuffle(interleaveBySource(items), items.length * 13 + 7);
  const cycles: GalleryCycle[] = [];
  let cursor = 0;
  let cycleId = 0;

  while (cursor < pool.length) {
    const rowKind: GalleryRowKind = cycleId % 2 === 0 ? "pair" : "triple";
    const rowSize = rowKind === "pair" ? 2 : 3;
    const rowItems = pool.slice(cursor, cursor + rowSize);
    if (!rowItems.length) break;
    cursor += rowItems.length;

    const focusIndex = pickFocusIndex(cycleId, rowItems.length);

    const railItems: GalleryItem[] = rowKind === "pair" ? pool.slice(cursor, cursor + 5) : [];
    cursor += railItems.length;

    const verticalRows: GalleryItem[][] = [];
    if (rowKind === "triple") {
      for (let r = 0; r < 2; r++) {
        const row = pool.slice(cursor, cursor + 3);
        if (!row.length) break;
        verticalRows.push(row);
        cursor += row.length;
      }
    }

    cycles.push({
      id: `cycle-${cycleId}`,
      rowKind,
      rowItems,
      focusIndex,
      railItems,
      verticalRows,
    });

    cycleId += 1;
    if (rowItems.length < rowSize && cursor >= pool.length) break;
  }

  return cycles;
}

/** @deprecated Use buildGalleryCycles */
export type GalleryBlockType = "scatter" | "fullscreen";
export type GalleryBlock = {
  id: string;
  type: GalleryBlockType;
  items: GalleryItem[];
  variant?: number;
};

export function buildGallerySequence(items: GalleryItem[]): GalleryBlock[] {
  return buildGalleryCycles(items).flatMap((c) => [
    { id: `${c.id}-row`, type: "scatter" as const, items: c.rowItems, variant: 0 },
  ]);
}

function seededShuffle<T>(arr: T[], seed = 7): T[] {
  const result = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Interleave sources so project / product / collection appear in mixed order. */
function interleaveBySource(items: GalleryItem[]): GalleryItem[] {
  const buckets: Record<GallerySource, GalleryItem[]> = {
    project: [],
    product: [],
    collection: [],
  };
  for (const item of items) {
    buckets[item.primary.source].push(item);
  }
  const max = Math.max(buckets.project.length, buckets.product.length, buckets.collection.length);
  const mixed: GalleryItem[] = [];
  for (let i = 0; i < max; i++) {
    for (const key of ["project", "product", "collection"] as GallerySource[]) {
      if (buckets[key][i]) mixed.push(buckets[key][i]);
    }
  }
  return mixed.length ? mixed : items;
}
