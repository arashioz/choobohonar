import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "../../login/LoginForm";

export const metadata: Metadata = {
  title: "ورود به پنل",
};

/**
 * The public admin URL is `/admin/login`. Keep the page inside the same
 * filesystem namespace as every other admin route now that the Next basePath
 * is intentionally disabled.
 */
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-forest text-paper/60">
          در حال بارگذاری…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
