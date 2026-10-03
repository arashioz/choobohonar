import type { Metadata } from "next";
import InteriorDesignBriefForm from "@/components/interior/InteriorDesignBriefForm";
import { readInteriorPageContent } from "@/lib/interior-page-content";
import { fetchPublicCmsPage } from "@/lib/public-cms";

export const metadata: Metadata = {
  title: "فرم سفارش طراحی داخلی | خانه چوب و هنر",
  description:
    "فرم هوشمند سفارش طراحی داخلی خانه چوب و هنر؛ انتخاب سبک، تصاویر الهام‌بخش و ثبت جزئیات فنی پروژه.",
};

export default async function InteriorDesignOrderPage() {
  const page = await fetchPublicCmsPage("interior");
  const content = readInteriorPageContent(page);
  return <InteriorDesignBriefForm content={content} />;
}
