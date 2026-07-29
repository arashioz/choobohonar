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
  const isBrandbook = pathname.startsWith("/admin/brandbook");

  return (
    <>
      {!isBrandbook && <AdminSidebar />}
      <div className={cn(!isBrandbook && "pr-[72px]")}>{children}</div>
    </>
  );
}
