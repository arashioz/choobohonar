"use client";

import { useEffect, useState } from "react";
import { parseUtm, smsDefaultUtm, UTM_STORAGE_KEY, type UtmState } from "@/data/channels";

export function useCampaignUtm() {
  const [utm, setUtm] = useState<UtmState>(smsDefaultUtm);

  useEffect(() => {
    const fromUrl = parseUtm(window.location.search);
    if (fromUrl.source || fromUrl.channel) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
      setUtm(fromUrl);
      return;
    }
    try {
      const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (stored) {
        setUtm(JSON.parse(stored) as UtmState);
        return;
      }
    } catch {
      /* ignore */
    }
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(smsDefaultUtm));
    setUtm(smsDefaultUtm);
  }, []);

  return utm;
}
