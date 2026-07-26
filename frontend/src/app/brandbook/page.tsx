"use client";

import { useEffect } from "react";

/** Keep `/brandbook` working — send users to admin brandbook (login required). */
export default function BrandbookRedirectPage() {
  useEffect(() => {
    const target =
      process.env.NEXT_PUBLIC_BRANDBOOK_URL ||
      `${window.location.protocol}//${window.location.hostname}:3003/admin/brandbook`;
    window.location.replace(target);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
      در حال انتقال به برندبوک…
    </div>
  );
}
