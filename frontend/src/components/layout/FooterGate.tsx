"use client";

import { usePathname } from "next/navigation";
import ExperienceFooter from "@/components/experience/ExperienceFooter";

export default function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/Experience" || pathname === "/experience") return <ExperienceFooter />;
  return children;
}
