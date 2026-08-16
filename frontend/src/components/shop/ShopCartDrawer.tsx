"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cartStore, type CartItem } from "@/lib/cart";
import { cn, toFa } from "@/lib/utils";

function isShopRoute(pathname: string) {
  return (
    pathname === "/products" ||
    pathname.startsWith("/products/") ||
    pathname === "/cart" ||
    pathname.startsWith("/checkout")
  );
}

function formatPrice(n: number) {
  return `${toFa(n.toLocaleString("en-US"))} تومان`;
}

export default function ShopCartDrawer() {
  const pathname = usePathname();
  const router = useRouter();
  const visible = isShopRoute(pathname);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [bounce, setBounce] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [highlightSlug, setHighlightSlug] = useState<string | null>(null);
  const [justAddedName, setJustAddedName] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setItems(cartStore.get());
    sync();
    window.addEventListener("choobohonar:cart", sync);
    return () => window.removeEventListener("choobohonar:cart", sync);
  }, []);

  useEffect(() => {
    const onAdd = (event: Event) => {
      const detail = (event as CustomEvent<{ slug: string; name: string }>).detail;
      setBounce(true);
      setPulse(true);
      setOpen(true);
      if (detail?.slug) setHighlightSlug(detail.slug);
      if (detail?.name) setJustAddedName(detail.name);
      window.setTimeout(() => setBounce(false), 700);
      window.setTimeout(() => setPulse(false), 1200);
      window.setTimeout(() => setHighlightSlug(null), 1600);
      window.setTimeout(() => setJustAddedName(null), 2200);
    };
    window.addEventListener("choobohonar:cart-add", onAdd);
    return () => window.removeEventListener("choobohonar:cart-add", onAdd);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!visible) return null;

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

  return (
    <>
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        {justAddedName ? (
          <div className="cart-toast-in pointer-events-none max-w-[220px] rounded-2xl border border-peach/40 bg-forest px-3 py-2 text-xs text-paper shadow-lg shadow-forest/30">
            «{justAddedName}» به سبد اضافه شد
          </div>
        ) : null}

        <button
          type="button"
          aria-label="سبد خرید"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-paper shadow-[0_12px_40px_-12px_rgba(28,45,38,0.65)] transition-colors hover:bg-forest-700",
            open && "ring-2 ring-peach/70",
            bounce && "cart-fab-bounce",
          )}
        >
          {pulse ? (
            <span
              className="cart-ring-pulse absolute inset-0 rounded-2xl bg-peach/40"
              aria-hidden
            />
          ) : null}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 7h15l-1.4 8.2a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.6L5 3H2"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="20" r="1.3" fill="currentColor" />
            <circle cx="17" cy="20" r="1.3" fill="currentColor" />
          </svg>
          {count > 0 ? (
            <span
              key={count}
              className="cart-badge-pop absolute -left-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-peach px-1 text-[11px] font-medium text-forest"
            >
              {toFa(count)}
            </span>
          ) : null}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label="بستن سبد"
            className="cart-backdrop-in absolute inset-0 bg-forest/35 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <aside
            className="cart-drawer-in absolute bottom-0 right-0 flex h-[min(88vh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-forest/10 bg-paper shadow-2xl sm:bottom-5 sm:right-5 sm:h-[min(78vh,620px)] sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
            aria-label="سبد خرید"
          >
            <header className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-brick">CART</p>
                <h2 className="mt-1 text-lg font-light text-forest">سبد خرید</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-forest/10 text-forest/60 transition-colors hover:bg-forest/5 hover:text-forest"
                aria-label="بستن"
              >
                ×
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center">
                  <p className="text-sm text-forest/55">سبد خالی است</p>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="mt-3 text-sm text-brick hover:underline"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.slug}
                    className={cn(
                      "flex gap-3 rounded-2xl border border-forest/8 bg-white/70 p-3",
                      highlightSlug === item.slug && "cart-item-flash",
                    )}
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-forest/5">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${encodeURIComponent(item.slug)}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm text-forest hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-forest/50">
                        {formatPrice(item.unitPrice)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-forest/15 text-sm"
                          onClick={() => cartStore.setQty(item.slug, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs">{toFa(item.qty)}</span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-forest/15 text-sm"
                          onClick={() => cartStore.setQty(item.slug, item.qty + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ms-auto text-[11px] text-forest/40 hover:text-brick"
                          onClick={() => cartStore.remove(item.slug)}
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="border-t border-forest/10 bg-white/80 px-5 py-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-forest/55">جمع</span>
                <span className="font-medium text-forest">
                  {items.length ? formatPrice(subtotal) : "—"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-forest/15 px-3 py-2.5 text-xs text-forest transition-colors hover:bg-forest/5"
                >
                  مشاهده سبد
                </Link>
                <button
                  type="button"
                  disabled={!items.length}
                  onClick={() => {
                    setOpen(false);
                    router.push("/checkout");
                  }}
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-xs transition-colors",
                    items.length
                      ? "bg-forest text-paper hover:bg-forest-700"
                      : "cursor-not-allowed bg-forest/20 text-forest/40",
                  )}
                >
                  ادامه خرید
                </button>
              </div>
            </footer>
          </aside>
        </div>
      ) : null}
    </>
  );
}
