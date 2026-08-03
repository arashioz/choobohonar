import type { Metadata } from "next";
import CartPageClient from "@/components/commerce/cart/CartPageClient";

export const metadata: Metadata = {
  title: "سبد خرید | خانه چوب و هنر",
  description: "مرور محصولات انتخاب‌شده، تغییر تعداد و ادامه فرایند خرید از خانه چوب و هنر.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
