"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type MapPoint = { lat: number; lng: number };

type Props = {
  value: MapPoint;
  onChange: (point: MapPoint) => void;
  className?: string;
};

const TEHRAN = { lat: 35.6892, lng: 51.389 };

export default function LocationMapPicker({ value, onChange, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !containerRef.current || mapRef.current) return;

      // Fix default marker icons in bundlers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const start = value.lat && value.lng ? value : TEHRAN;
      const map = L.map(containerRef.current, {
        center: [start.lat, start.lng],
        zoom: 13,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([start.lat, start.lng], { draggable: true }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChangeRef.current({ lat: pos.lat, lng: pos.lng });
      });

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        marker.setLatLng(e.latlng);
        onChangeRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      mapRef.current = map;
      markerRef.current = marker;

      // Ensure size after layout
      setTimeout(() => map.invalidateSize(), 80);
    }

    void init();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // intentionally only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return;
    const current = markerRef.current.getLatLng();
    if (Math.abs(current.lat - value.lat) < 1e-7 && Math.abs(current.lng - value.lng) < 1e-7) {
      return;
    }
    markerRef.current.setLatLng([value.lat, value.lng]);
    mapRef.current.panTo([value.lat, value.lng]);
  }, [value.lat, value.lng]);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError("مرورگر شما موقعیت مکانی را پشتیبانی نمی‌کند.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("دسترسی به موقعیت مکانی مجاز نشد؛ نقطه را روی نقشه انتخاب کنید.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-forest/10", className)}>
      <div ref={containerRef} className="h-72 w-full bg-forest/5 sm:h-80" />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-forest/10 bg-white/80 px-3 py-2 text-[11px] text-forest/50">
        <span>روی نقشه کلیک کنید یا پین را بکشید</span>
        <button type="button" onClick={useCurrentLocation} disabled={locating} className="rounded-lg border border-forest/15 px-2.5 py-1 text-[10px] text-forest transition-colors hover:border-forest/40 disabled:opacity-50">
          {locating ? "در حال دریافت…" : "دریافت موقعیت فعلی"}
        </button>
        <span dir="ltr">
          {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
        </span>
      </div>
      {locationError ? <p className="border-t border-brick/10 bg-brick/5 px-3 py-2 text-[10px] text-brick">{locationError}</p> : null}
    </div>
  );
}
