"use client";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function AdminDashboard() {
  const [targets, setTargets] = useState<Array<{ name: string; mapping: any }>>([]);
  const [token, setToken] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [foundImages, setFoundImages] = useState<string[]>([]);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) setToken(t);
    fetchTargets();
  }, []);

  async function fetchTargets() {
    const res = await fetch(`${API_BASE}/admin/targets`);
    const data = await res.json();
    setTargets(data.targets || []);
  }

  async function handleUpload(targetName: string, file: File | null) {
    if (!file) return;
    const tkn = localStorage.getItem('admin_token');
    if (!tkn) return alert('ابتدا وارد شوید');
    try {
      setUploading(targetName);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('target', targetName);
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tkn}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        await fetchTargets();
      } else {
        alert('Upload failed');
      }
    } catch (e) {
      alert('Upload error');
    } finally {
      setUploading(null);
    }
  }

  // Scan a set of public pages for <img> tags and collect image URLs.
  // This runs in the browser and fetches the pages as HTML, then parses them.
  async function scanSite() {
    setScanning(true);
    try {
      // Start with a list of routes to scan. We also include the known targets
      // as potential pages to visit (some sites expose per-target pages).
      const routes = ['/', '/products', '/projects', '/magazine', '/admin'];

      const imgs = new Set<string>();
      await Promise.all(
        routes.map(async (r) => {
          try {
            const res = await fetch(r, { cache: 'no-store' });
            if (!res.ok) return;
            const text = await res.text();
            // Parse HTML and extract <img src=> values
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const imageEls = Array.from(doc.querySelectorAll('img'));
            imageEls.forEach((el) => {
              const s = el.getAttribute('src');
              if (s) imgs.add(s);
            });
            // Also find any occurrences of /uploads/ in the HTML text
            const re = /(?<=src=\")([^\"]*uploads\/[^"]+)/g;
            let m;
            while ((m = re.exec(text)) !== null) {
              imgs.add(m[0]);
            }
          } catch (e) {
            // ignore per-route failures
          }
        }),
      );

      setFoundImages(Array.from(imgs));
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">داشبورد ادمین</h2>
      <div className="mb-4 flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-3">
          <button
            onClick={scanSite}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={scanning}
          >
            {scanning ? 'در حال اسکن...' : 'اسکن سایت برای تصاویر'}
          </button>
          <a href="/admin/uploads" className="px-3 py-1 bg-blue-600 text-white rounded">صفحه آپلودها</a>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {targets.map((t) => (
          <div key={t.name} className="p-4 border rounded">
            <div className="text-sm text-gray-600 mb-2">{t.name}</div>
            {t.mapping ? (
              <div>
                <img src={t.mapping.url} className="w-full h-32 object-cover mb-2" />
                <div className="text-xs text-gray-500">{t.mapping.filename}</div>
                <div className="mt-2">
                  <label className="text-xs text-gray-500">آپلود جدید</label>
                  <input type="file" onChange={(e) => handleUpload(t.name, e.target.files?.[0] ?? null)} disabled={!!uploading} />
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-red-500">بدون تصویر</div>
                <div className="mt-2">
                  <input type="file" onChange={(e) => handleUpload(t.name, e.target.files?.[0] ?? null)} disabled={!!uploading} />
                </div>
              </div>
            )}
            {uploading === t.name && <div className="text-xs text-gray-500 mt-2">در حال آپلود...</div>}
          </div>
        ))}
      </div>
      {foundImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">تصاویر پیدا شده در سایت</h3>
          <div className="grid grid-cols-3 gap-3">
            {foundImages.map((src) => (
              <div key={src} className="p-2 border rounded">
                <div className="text-xs text-gray-500 mb-2 break-words">{src}</div>
                <img src={src} className="w-full h-32 object-cover mb-2" />
                <ReplaceWidget src={src} onUploaded={() => fetchTargets()} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReplaceWidget({ src, onUploaded }: { src: string; onUploaded?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

  async function doUpload() {
    if (!file) return;
    const tkn = localStorage.getItem('admin_token');
    if (!tkn) return alert('ابتدا وارد شوید');
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tkn}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) {
        alert('فایل آپلود شد. آدرس جدید در کلیپبورد کپی شد.');
        navigator.clipboard.writeText(data.url).catch(() => {});
        onUploaded?.();
      } else {
        alert('Upload failed');
      }
    } catch (e) {
      alert('Upload error');
    } finally {
      setBusy(false);
      setFile(null);
    }
  }

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="mt-2">
        <button onClick={doUpload} disabled={!file || busy} className="px-3 py-1 bg-green-600 text-white rounded">
          آپلود و گرفتن آدرس جدید
        </button>
      </div>
    </div>
  );
}
