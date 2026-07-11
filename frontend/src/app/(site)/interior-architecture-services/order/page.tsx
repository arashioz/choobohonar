import type { Metadata } from "next";
import InteriorDesignBriefForm from "@/components/interior/InteriorDesignBriefForm";

export const metadata: Metadata = {
  title: "فرم سفارش طراحی داخلی | خانه چوب و هنر",
  description:
    "فرم هوشمند سفارش طراحی داخلی خانه چوب و هنر؛ انتخاب سبک، تصاویر الهام‌بخش و ثبت جزئیات فنی پروژه.",
};

export default function InteriorDesignOrderPage() {
  return <InteriorDesignBriefForm />;
}
