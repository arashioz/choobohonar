"use client";

import { usePathname } from "next/navigation";
import ChatPanel from "@/components/brandbook/layout/ChatPanel";
import BrandbookMotionShell from "@/components/brandbook/layout/BrandbookMotionShell";

export default function BrandbookLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPrint = pathname.startsWith("/admin/brandbook/print");

  if (isPrint) {
    return (
      <div className="bg-paper brandbook-print-root" data-brandbook-print="true">
        <main>{children}</main>
      </div>
    );
  }

  return (
    <BrandbookMotionShell>
      <div className="min-h-screen bg-forest relative">
        <main className="min-h-screen">{children}</main>
        <ChatPanel />
      </div>
    </BrandbookMotionShell>
  );
}
