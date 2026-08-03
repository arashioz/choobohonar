import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "ورود به پنل",
};

export default function LoginPage() {
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
