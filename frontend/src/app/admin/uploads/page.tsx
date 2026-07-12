"use client";
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function UploadsPage() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  async function fetchAssets() {
    try {
      const res = await fetch(`${API_BASE}/admin/assets`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      setFiles([]);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">آپلودها</h2>
      <div className="grid grid-cols-4 gap-3">
        {files.map((f) => (
          <div key={f} className="border p-2">
            <img src={`/uploads/${f}`} className="w-full h-36 object-cover mb-2" />
            <div className="text-xs text-gray-600 break-words">{f}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
