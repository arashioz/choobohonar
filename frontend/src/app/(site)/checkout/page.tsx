import type { Metadata } from "next";
import CheckoutPageClient from "@/components/shop/CheckoutPageClient";

export const metadata: Metadata = {
  title: "تسویه حساب | خانه چوب و هنر",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
