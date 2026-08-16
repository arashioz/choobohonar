import type { Metadata } from "next";
import ContactHub from "@/components/contact/ContactHub";

export const metadata: Metadata = {
  title: "تماس با ما | خانه چوب و هنر",
  description:
    "فرم تماس خانه چوب و هنر برای سفارش، مشاوره معماری داخلی، ارسال محصول و خدمات پس از فروش؛ یا درخواست همکاری و نمایندگی.",
};

export default function ContactPage() {
  return <ContactHub />;
}
