import type { Metadata } from "next";
import ShopProductForm from "@/components/shop/ShopProductForm";

export const metadata: Metadata = {
  title: "محصول جدید | فروشگاه",
};

export default function NewShopProductPage() {
  return <ShopProductForm />;
}
