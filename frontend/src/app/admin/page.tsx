"use client";

import { FormEvent, useState } from "react";
import Dock from "../../components/admin/Dock";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function AdminPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [token, setToken] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<Array<{ filename: string; url: string }>>([]);
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setToken(data.token);
      window.location.href = "/admin/dashboard";
    } catch {
      setError("ارتباط با سرور برقرار نشد. مطمئن شوید API روی پورت 3001 در حال اجرا است.");
    } finally {
      setLoading(false);
    }
  }

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !token) return;
    const fd = new FormData();
    fd.append("file", file);
    if (target) fd.append("target", target);
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (data.url) setImages((prev) => [data, ...prev]);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">پنل ادمین</h1>

        {!token ? (
          <form onSubmit={login} className="space-y-3">
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="choobhonar"
              autoComplete="username"
              className="w-full border p-2"
              dir="ltr"
            />
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              className="w-full border p-2"
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
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
            >
              {loading ? "در حال ورود…" : "ورود"}
            </button>
          </form>
        ) : (
          <div>
            <form onSubmit={upload} className="mb-4 space-y-3">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="placement target (e.g. hero, gallery)"
                className="w-full border p-2"
              />
              <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white">
                آپلود
              </button>
            </form>
            <div className="grid grid-cols-3 gap-3">
              {images.map((img) => (
                <div key={img.filename} className="bg-gray-100 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="uploaded" className="h-32 w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Dock />
    </div>
  );
}
