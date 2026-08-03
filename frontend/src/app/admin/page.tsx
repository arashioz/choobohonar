"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBase } from "@/lib/api-base";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${getApiBase()}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: user, password: pass }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        token?: string;
        message?: string;
      };

      if (!res.ok || !data.token) {
        setError(
          data.message === "Invalid credentials"
            ? "نام کاربری یا رمز عبور اشتباه است"
            : data.message || "ورود ناموفق بود",
        );
        return;
      }

      localStorage.setItem("admin_token", data.token);
      router.replace("/admin/dashboard");
    } catch {
      setError("ارتباط با API برقرار نشد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={login}
        className="w-full max-w-sm space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-xl font-semibold text-gray-900">ورود ادمین</h1>
          <p className="mt-1 text-sm text-gray-500">خانه چوب و هنر</p>
        </div>

        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="choobhonar"
          autoComplete="username"
          required
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          dir="ltr"
        />
        <input
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="••••••••"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          dir="ltr"
        />

        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "در حال ورود…" : "ورود"}
        </button>
      </form>
    </div>
  );
}
