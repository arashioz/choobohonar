import type { Metadata } from "next";
import CheckoutFlow from "@/components/commerce/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "تکمیل خرید | خانه چوب و هنر",
  description: "ثبت اطلاعات مشتری، آدرس تحویل و بازبینی نهایی سفارش خانه چوب و هنر.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
