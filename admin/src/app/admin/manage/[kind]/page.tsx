import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ResourceWorkspace from "@/components/dashboard/ResourceWorkspace";
import ShopAdminPage from "@/components/shop/ShopAdminPage";
import { Suspense } from "react";
import type { ResourcePath } from "@/lib/cms";

const kinds: ResourcePath[] = ["products", "materials", "projects", "collections"];
const titles: Record<ResourcePath, string> = { products: "محصولات", materials: "متریال‌ها", projects: "پروژه‌ها", collections: "کالکشن‌ها" };

export function generateStaticParams() {
  return kinds.map((kind) => ({ kind }));
}

export async function generateMetadata({ params }: { params: Promise<{ kind: string }> }): Promise<Metadata> {
  const { kind } = await params;
  return { title: kinds.includes(kind as ResourcePath) ? titles[kind as ResourcePath] : "مدیریت آثار" };
}

export default async function ManagementSectionPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!kinds.includes(kind as ResourcePath)) notFound();
  if (kind === "products") return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-paper text-sm text-forest/50">در حال بارگذاری محصولات…</div>}><ShopAdminPage productsOnly /></Suspense>;
  return <ResourceWorkspace kind={kind as ResourcePath} />;
}
