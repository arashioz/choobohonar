"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { cn } from "@/lib/utils";

export default function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  const isBrandbook = pathname.startsWith("/admin/brandbook");
  const isSeoWorkspace = pathname.startsWith("/admin/seo");
  const isStandalone = isLogin || isBrandbook || isSeoWorkspace;

  return (
    <>
      {!isStandalone && <AdminSidebar />}
      <div className={cn(!isStandalone && "pb-24 pt-16 md:pb-0 md:pr-[248px] md:pt-0")}>{children}</div>
    </>
  );
}
