import type { Metadata } from "next";
import ContactHub from "@/components/contact/ContactHub";

export const metadata: Metadata = {
  title: "ارتباط با ما | خانه چوب و هنر",
  description:
    "درخواست همکاری، نمایندگی فروش یا مشاوره تخصصی — مسیر مناسب خود را در بخش ارتباط با ما انتخاب کنید.",
};

export default function ContactPage() {
  return <ContactHub />;
}
