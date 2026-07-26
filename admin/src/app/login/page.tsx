import { Suspense } from "react";
import LoginForm from "./LoginForm";

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
