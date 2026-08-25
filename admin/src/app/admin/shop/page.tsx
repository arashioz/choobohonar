import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import ShopAdminPage from "@/components/shop/ShopAdminPage";

export const metadata: Metadata = {
  title: "فروشگاه | پنل مدیریت",
  description: "سفارشات آنلاین و فاکتورهای فروشگاه",
};

export default async function AdminShopPage({ searchParams }: { searchParams: Promise<{ tab?: string; room?: string }> }) {
  // The product catalog lives exclusively in مدیریت آثار.
  const query = await searchParams;
  if (query.tab === "products" || query.room) redirect(`/admin/manage/products${query.room ? `?room=${encodeURIComponent(query.room)}` : ""}`);
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-forest/50">
          در حال بارگذاری فروشگاه…
        </div>
      }
    >
      <ShopAdminPage />
    </Suspense>
  );
}
