import type { Metadata } from "next";
import InteriorDesignBriefForm, { type BriefContent } from "@/components/interior/InteriorDesignBriefForm";
import {
  budgetOptions,
  consultationOptions,
  interiorStyles,
  moodboardImages,
  spaceTypeOptions,
  timelineOptions,
} from "@/data/interior-architecture";
import { fetchPublicCmsPage } from "@/lib/public-cms";

export const metadata: Metadata = {
  title: "فرم سفارش طراحی داخلی | خانه چوب و هنر",
  description:
    "فرم هوشمند سفارش طراحی داخلی خانه چوب و هنر؛ انتخاب سبک، تصاویر الهام‌بخش و ثبت جزئیات فنی پروژه.",
};

export default async function InteriorDesignOrderPage() {
  const page = await fetchPublicCmsPage<Partial<BriefContent>>("interior");
  const data = page?.items;
  const content: BriefContent = {
    styles: data?.styles || interiorStyles,
    moodboardImages: data?.moodboardImages || moodboardImages,
    spaceTypeOptions: data?.spaceTypeOptions || spaceTypeOptions,
    budgetOptions: data?.budgetOptions || budgetOptions,
    timelineOptions: data?.timelineOptions || timelineOptions,
    consultationOptions: data?.consultationOptions || consultationOptions,
  };
  return <InteriorDesignBriefForm content={content} />;
}
