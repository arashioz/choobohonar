"use client";
import { useState } from 'react';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<Array<{ filename: string; url: string }>>([]);
  const [target, setTarget] = useState<string>('');

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
    });
    const data = await res.json();
    if (data.token) setToken(data.token);
  }

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !token) return;
    const fd = new FormData();
    fd.append('file', file);
    if (target) fd.append('target', target);
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (data.url) setImages(prev => [data, ...prev]);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">پنل ادمین</h1>

        {!token ? (
          <form onSubmit={login} className="space-y-3">
            <input value={user} onChange={e => setUser(e.target.value)} placeholder="username" className="w-full p-2 border" />
            <input value={pass} onChange={e => setPass(e.target.value)} placeholder="password" type="password" className="w-full p-2 border" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded">ورود</button>
          </form>
        ) : (
          <div>
              <form onSubmit={upload} className="space-y-3 mb-4">
               <input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)} />
               <input value={target} onChange={e => setTarget(e.target.value)} placeholder="placement target (e.g. hero, gallery)" className="w-full p-2 border" />
              <button className="px-4 py-2 bg-green-600 text-white rounded">آپلود</button>
            </form>
            <div className="grid grid-cols-3 gap-3">
              {images.map(img => (
                <div key={img.filename} className="bg-gray-100 p-2">
                  <img src={img.url} alt="uploaded" className="w-full h-32 object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
