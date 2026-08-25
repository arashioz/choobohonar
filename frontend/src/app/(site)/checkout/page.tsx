import type { Metadata } from "next";
import CheckoutFlow from "@/components/commerce/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "تسویه حساب | خانه چوب و هنر",
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
