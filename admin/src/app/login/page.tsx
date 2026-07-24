import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden />

      <div
        className={cn(
          "relative z-10 w-full max-w-[26rem]",
          "overflow-hidden rounded-2xl border border-forest/10 bg-white",
          "shadow-[0_12px_48px_rgba(9,43,28,0.07)]"
        )}
      >
        <div className="h-1 bg-gradient-to-l from-peach via-peach-deep to-peach" aria-hidden />

        <div className="px-7 pb-7 pt-8 sm:px-9 sm:pb-8 sm:pt-9">
          <div className="flex flex-col items-center border-b border-forest/8 pb-7 text-center">
            <span className="relative mb-4 block h-11 w-10">
              <Image
                src="/brand/monogram-black.svg"
                alt=""
                fill
                priority
                aria-hidden
                className="object-contain object-center"
              />
            </span>
            <h1 className="text-xl font-light tracking-tightest text-forest sm:text-2xl">
              خانه چوب و هنر
            </h1>
            <p className="eyebrow mt-2.5 text-brick">ورود به برندبوک</p>
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-forest/65">
                ایمیل
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="example@choobohonar.com"
                className={fieldClass}
                dir="ltr"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-forest/65">
                رمز عبور
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className={fieldClass}
                dir="ltr"
              />
            </div>

            <Link
              href="/brandbook"
              className={cn(
                "group relative mt-1 flex w-full items-center justify-center overflow-hidden rounded-xl bg-forest px-6 py-3.5 text-sm font-medium text-paper",
                "transition-all duration-500 ease-out-expo hover:shadow-md hover:shadow-forest/15",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              )}
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-right scale-x-0 bg-peach transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
              />
              <span className="relative z-10 transition-colors duration-500 ease-out-expo group-hover:text-forest">
                ورود
              </span>
            </Link>
          </div>
        </div>

        <p className="border-t border-forest/8 bg-paper/35 px-7 py-4 text-center text-xs leading-relaxed text-forest/50 sm:px-9">
          صفحه UI — اتصال به بک‌اند در فاز بعدی
        </p>
      </div>
    </div>
  );
}

const fieldClass = cn(
  "w-full rounded-xl border border-forest/12 bg-paper/25 px-4 py-3 text-sm text-forest placeholder:text-forest/40 transition-colors focus:border-forest/35 focus:bg-white focus:outline-none"
);
