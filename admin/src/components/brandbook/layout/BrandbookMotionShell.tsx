"use client";

import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";

export default function BrandbookMotionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <ScrollProgress />
      {children}
    </SmoothScroll>
  );
}
