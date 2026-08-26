import type { Metadata } from "next";
import PagesWorkspace from "@/components/dashboard/PagesWorkspace";

export const metadata: Metadata = { title: "صفحات و تنظیمات محتوا" };
export default function PagesPage() { return <PagesWorkspace />; }
