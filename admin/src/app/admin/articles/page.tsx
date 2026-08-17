import type { Metadata } from "next";
import ArticlesWorkspace from "@/components/dashboard/ArticlesWorkspace";

export const metadata: Metadata = { title: "مدیریت مقالات" };
export default function ArticlesPage() { return <ArticlesWorkspace />; }
