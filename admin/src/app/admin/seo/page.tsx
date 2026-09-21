import type { Metadata } from "next";
import SeoPlaybook from "@/components/seo/SeoPlaybook";

export const metadata: Metadata = { title: "داشبورد سئو" };

export default function SeoDashboardPage() {
  return <SeoPlaybook />;
}
