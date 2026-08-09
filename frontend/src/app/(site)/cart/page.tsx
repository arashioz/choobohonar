import type { Metadata } from "next";
import CartPageClient from "@/components/shop/CartPageClient";

export const metadata: Metadata = {
  title: "سبد خرید | خانه چوب و هنر",
};

export default function CartPage() {
  return <CartPageClient />;
}
