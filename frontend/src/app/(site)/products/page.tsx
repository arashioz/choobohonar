import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsCatalogPage from "@/components/products/ProductsCatalogPage";

export const metadata: Metadata = {
  title: "محصولات | خانه چوب و هنر",
  description: "مجموعه‌ای از مبلمان و دکوراتیو خانه چوب و هنر، با امکان انتخاب پرداخت چوب و استعلام قیمت اختصاصی.",
};

export default function ProductsIndexPage() {
  return (
    <Suspense>
      <ProductsCatalogPage />
    </Suspense>
  );
}
