"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function GHLTracker() {
  const [enabled, setEnabled] = useState(process.env.NODE_ENV !== "development");
  const [mounted, setMounted] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const stored = localStorage.getItem("ms_ghl_enabled");
    setEnabled(stored === "true");
    setMounted(true);
  }, []);

  if (!mounted || !enabled) return null;

  return (
    <Script
      src="https://link.marketstack.ai/js/external-tracking.js"
      data-tracking-id="tk_2a1c91aa54a24bba81a4f2271ad991d9"
      data-debug={process.env.NODE_ENV === "development" ? "true" : undefined}
      strategy="afterInteractive"
    />
  );
}
