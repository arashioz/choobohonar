"use client";
import React from 'react';

export default function Dock() {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50">
      <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
        <a href="/admin/dashboard" className="flex flex-col items-center text-xs text-gray-700">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">🏠</div>
          داشبورد
        </a>
        <a href="/admin/uploads" className="flex flex-col items-center text-xs text-gray-700">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">📁</div>
          آپلودها
        </a>
        <a href="/admin" className="flex flex-col items-center text-xs text-gray-700">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">🔐</div>
          لاگین
        </a>
      </div>
    </div>
  );
}
