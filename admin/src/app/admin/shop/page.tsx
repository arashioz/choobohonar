import type { Metadata } from "next";
import { Suspense } from "react";
import ShopAdminPage from "@/components/shop/ShopAdminPage";

export const metadata: Metadata = {
  title: "فروشگاه | پنل مدیریت",
  description: "سفارشات آنلاین و فاکتورهای فروشگاه",
};

export default function AdminShopPage() {
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
