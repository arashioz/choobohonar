import Image from "next/image";
import Link from "next/link";
import type { ShopProduct } from "@/data/products";
import { formatCatalogPrice, getCollectionName } from "@/lib/commerce";
import { isUploadedMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

type CommerceProductCardProps = {
  product: ShopProduct;
  priority?: boolean;
  className?: string;
  imageAspect?: "portrait" | "square" | "landscape";
};

const aspectClasses = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[5/4]",
};

export default function CommerceProductCard({
  product,
  priority = false,
  className,
  imageAspect = "portrait",
}: CommerceProductCardProps) {
  const collection = getCollectionName(product);

  return (
    <article className={cn("group h-full min-w-0", className)}>
      <Link href={`/products/${product.slug}`} className="group flex h-full flex-col focus-visible:outline-none">
        <div
          className={cn(
            "relative overflow-hidden bg-forest/[0.045]",
            aspectClasses[imageAspect],
            "transition-colors duration-500 group-hover:bg-forest/[0.07]",
          )}
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              unoptimized={isUploadedMedia(product.image)}
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 32vw"
              className="media-hover object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-forest/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
            {collection ? (
              <span className="rounded-full bg-paper/90 px-3 py-1.5 text-[11px] font-medium text-forest backdrop-blur-md">
                کالکشن {collection}
              </span>
            ) : (
              <span />
            )}
            <span
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-medium backdrop-blur-md",
                product.isInStock ? "bg-forest/85 text-paper" : "bg-paper/90 text-brick",
              )}
            >
              {product.isInStock ? "موجود" : "سفارش تولید"}
            </span>
          </div>

          <span className="absolute bottom-4 left-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-peach text-xl text-forest opacity-0 transition-[transform,opacity] duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            ↙
          </span>
        </div>

        <div className="mt-4 flex flex-1 items-start justify-between gap-4 border-b border-forest/10 pb-4">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-[0.14em] text-brick">{product.category}</p>
            <h3 className="mt-2 truncate text-xl font-light tracking-tight text-forest transition-colors duration-300 group-hover:text-brick group-focus-visible:text-brick md:text-2xl">
              {product.name}
            </h3>
          </div>
          <p className="shrink-0 pt-6 text-sm font-medium text-forest/70">
            {formatCatalogPrice(product)}
          </p>
        </div>
      </Link>
    </article>
  );
}
