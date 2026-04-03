"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function GHLTracker() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const stored = localStorage.getItem("ms_ghl_enabled");
      if (stored !== null) {
        setEnabled(stored === "true");
      } else {
        if (pathname === "/audit/start" || pathname === "/contact") {
          localStorage.setItem("ms_ghl_enabled", "false");
          setEnabled(false);
        }
      }
      setMounted(true);
    }
  }, [pathname]);

  if (!mounted || !enabled) return null;

  return (
    <Script
      key={pathname} 
      src={`https://link.marketstack.ai/js/external-tracking.js?v=${pathname.replace(/\//g, '_')}`}
      data-tracking-id="tk_2a1c91aa54a24bba81a4f2271ad991d9"
      data-debug={process.env.NODE_ENV === "development" ? "true" : undefined}
      strategy="afterInteractive"
    />
  );
}
