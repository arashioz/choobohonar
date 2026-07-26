"use client";

import { useEffect } from "react";

/** Legacy alias → /admin/brandbook bridge on this same frontend origin. */
export default function BrandbookRedirectPage() {
  useEffect(() => {
    window.location.replace("/admin/brandbook");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
      در حال انتقال به برندبوک…
    </div>
  );
}
