"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };

      if (!res.ok) {
        setError(data.message || "ورود ناموفق بود");
        return;
      }

      router.replace(nextPath.startsWith("/") ? nextPath : "/admin");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-forest">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 brandbook-grid-dark opacity-40" />
        <div className="absolute -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full bg-peach/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[60vh] w-[60vw] rounded-full bg-teal/20 blur-[100px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-900/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-16">
        <div className="login-reveal lg:col-span-6">
          <div className="mb-8 flex items-center gap-4">
            <span className="relative block h-14 w-12 sm:h-16 sm:w-14">
              <Image
                src="/brand/monogram-white.svg"
                alt=""
                fill
                priority
                className="object-contain object-center"
              />
            </span>
            <span className="h-10 w-px bg-peach/40" aria-hidden />
            <p className="eyebrow text-peach">Choob o Honar</p>
          </div>

          <h1 className="max-w-md text-4xl font-light leading-[1.15] tracking-tightest text-paper sm:text-5xl lg:text-[3.5rem]">
            خانه چوب و هنر
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-paper/65 sm:text-lg">
            ورود به فضای مدیریت برند و برندبوک دیجیتال.
          </p>

          <div
            className="mt-10 hidden h-px w-24 bg-gradient-to-l from-peach to-transparent lg:block"
            aria-hidden
          />
        </div>

        <div className="login-reveal-delay lg:col-span-5 lg:col-start-8">
          <form
            onSubmit={onSubmit}
            className="relative overflow-hidden rounded-2xl border border-paper/10 bg-paper/[0.06] p-7 backdrop-blur-xl sm:p-9"
          >
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-peach/60 to-transparent"
              aria-hidden
            />

            <div className="mb-7">
              <h2 className="text-lg font-medium text-paper">ورود ادمین</h2>
              <p className="mt-1.5 text-sm text-paper/50">برای دسترسی به پنل، وارد شوید</p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="login-username"
                  className="mb-1.5 block text-xs font-medium text-paper/60"
                >
                  نام کاربری
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="choobhonar"
                  required
                  className={fieldClass}
                  dir="ltr"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-xs font-medium text-paper/60"
                >
                  رمز عبور
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={fieldClass}
                  dir="ltr"
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-peach/25 bg-peach/10 px-3.5 py-2.5 text-sm text-peach"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "group relative mt-1 flex w-full items-center justify-center overflow-hidden rounded-xl bg-peach px-6 py-3.5 text-sm font-medium text-forest",
                  "transition-all duration-500 ease-out-expo hover:shadow-lg hover:shadow-peach/20",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 focus-visible:ring-offset-forest",
                  "disabled:cursor-wait disabled:opacity-70",
                )}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-right scale-x-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                />
                <span className="relative z-10">
                  {loading ? "در حال ورود…" : "ورود به پنل"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const fieldClass = cn(
  "w-full rounded-xl border border-paper/15 bg-forest-900/40 px-4 py-3 text-sm text-paper placeholder:text-paper/35",
  "transition-colors focus:border-peach/50 focus:bg-forest-900/60 focus:outline-none",
);
