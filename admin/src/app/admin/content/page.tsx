import type { Metadata } from "next";
import ContentBotPage from "@/components/content-bot/ContentBotPage";

export const metadata: Metadata = {
  title: "چوب‌نویس | تولید محتوا",
  description: "استودیو تولید خودکار محتوا — خانه چوب و هنر",
};

export default function AdminContentPage() {
  return <ContentBotPage />;
}
