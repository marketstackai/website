"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface LCTrackingPageViewEvent {
  type: "external_script_page_view";
  timestamp: number;
  title: string;
  url: string;
  path: string;
  referrer: string;
  userAgent: string;
}

interface LCTrackingGlobal {
  tracker?: {
    sendEvent?: (event: LCTrackingPageViewEvent) => void;
    state?: { initialized?: boolean };
  };
}

declare global {
  interface Window {
    _lcTracking?: LCTrackingGlobal;
  }
}

export function GHLTracker() {
  const [enabled, setEnabled] = useState(process.env.NODE_ENV !== "development");
  const [mounted, setMounted] = useState(process.env.NODE_ENV !== "development");
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const stored = localStorage.getItem("ms_ghl_enabled");
    setEnabled(stored === "true");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Skip first run — the script fires its own pageview on initial load.
    if (previousPathRef.current === null) {
      previousPathRef.current = pathname;
      return;
    }
    if (previousPathRef.current === pathname) return;

    const previousPath = previousPathRef.current;
    previousPathRef.current = pathname;

    // Defer to next tick so Next.js has applied the new <title> metadata.
    const id = window.setTimeout(() => {
      const tracker = window._lcTracking?.tracker;
      if (!tracker?.state?.initialized || !tracker.sendEvent) return;

      tracker.sendEvent({
        type: "external_script_page_view",
        timestamp: Date.now(),
        title: document.title,
        url: window.location.href,
        path: pathname,
        referrer: `${window.location.origin}${previousPath}`,
        userAgent: navigator.userAgent,
      });
    }, 50);

    return () => window.clearTimeout(id);
  }, [pathname, enabled]);

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
