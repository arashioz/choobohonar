"use client";

import { useEffect, useState } from "react";
import { ORDERS_CHANGED_EVENT, shopApi } from "@/lib/shop-api";

const POLL_MS = 60_000;

/** Number of proformas waiting to be turned into an invoice; 0 while unknown. */
export function usePendingProformaCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (document.visibilityState === "hidden") return;
      shopApi.orders
        .stats()
        .then((stats) => {
          if (!cancelled) setCount(stats.pendingProforma || 0);
        })
        .catch(() => {});
    };
    refresh();
    const timer = window.setInterval(refresh, POLL_MS);
    window.addEventListener("focus", refresh);
    window.addEventListener(ORDERS_CHANGED_EVENT, refresh);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener(ORDERS_CHANGED_EVENT, refresh);
    };
  }, []);

  return count;
}
