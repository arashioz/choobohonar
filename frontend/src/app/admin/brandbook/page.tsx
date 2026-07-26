"use client";

import { useEffect, useState } from "react";

function brandbookTarget(): string {
  if (process.env.NEXT_PUBLIC_BRANDBOOK_URL) {
    return process.env.NEXT_PUBLIC_BRANDBOOK_URL;
  }
  if (typeof window === "undefined") return "/admin";
  return `${window.location.protocol}//${window.location.hostname}:3003/admin/brandbook`;
}

/**
 * Brandbook UI lives in the admin Next app (:3003).
 * This route exists so /admin/brandbook on the frontend (:3000) does not 404.
 */
export default function AdminBrandbookBridgePage() {
  const [message, setMessage] = useState("در حال انتقال به برندبوک…");

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      setMessage("ابتدا وارد شوید…");
      window.location.replace("/admin");
      return;
    }
    window.location.replace(brandbookTarget());
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
      {message}
    </div>
  );
}
