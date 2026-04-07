"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/sections/navbar/default";
import Footer from "@/components/sections/footer/default";
import Glow from "@/components/ui/glow";

const REF_SUBHEADINGS: Record<string, string> = {
  foundation: "Schedule a time to discuss the Foundation Kit.",
  os: "Let\u2019s get your Operating System deployed.",
  studio: "Tell us about your project in a discovery call.",
  workshop: "Let\u2019s plan your AI Starter Workshop.",
  "role-sprint": "Let\u2019s scope your Role-Based AI Sprint.",
  bootcamp: "Let\u2019s design your AI Bootcamp program.",
  "stack-audit":
    "Book your Stack Audit \u2014 $500 credits toward any project.",
  "ops-audit": "Let\u2019s scope your AI Operations Audit.",
  "growth-plan": "Let\u2019s map your AI Growth Infrastructure Plan.",
  "ai-receptionist": "Let\u2019s set up your AI Receptionist.",
  "speed-to-lead": "Let\u2019s build your Speed-to-Lead system.",
  workflow: "Let\u2019s scope your custom workflow automation.",
  "front-office": "Let\u2019s explore the AI Front Office system.",
};

const DEFAULT_SUBHEADING =
  "Pick a time that works for you. We\u2019ll handle the rest.";

const IFRAME_MIN_HEIGHT = 700;

export default function BookingContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const source = searchParams.get("source");
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const iframeUrl = new URL(
    "https://link.marketstack.ai/widget/booking/3kaQEdii0FF1El7xKgWY"
  );
  if (ref) iframeUrl.searchParams.set("ref", ref);
  if (source) iframeUrl.searchParams.set("source", source);

  const subheading =
    (ref && REF_SUBHEADINGS[ref]) || DEFAULT_SUBHEADING;

  // Listen for GHL form_embed.js resize messages — the first resize
  // means the calendar has rendered and measured itself.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (
        typeof e.data === "object" &&
        e.data !== null &&
        "type" in e.data &&
        String(e.data.type).includes("resize")
      ) {
        setReady(true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Fallback: if the postMessage never fires, reveal after a timeout.
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(id);
  }, []);

  const handleLoad = useCallback(() => {
    // iframe document loaded — give a brief moment for form_embed.js
    // to run its first resize before revealing via the postMessage listener.
    // If postMessage already fired, this is a no-op.
    const id = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-container mx-auto px-4 pt-32 pb-24 relative overflow-hidden">
        <div className="text-center mb-6 animate-appear">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
            Book a Call
          </h1>
          <p className="text-muted-foreground text-lg max-w-[540px] mx-auto text-balance">
            {subheading}
          </p>
        </div>

        <div
          className="rounded-2xl animate-appear [animation-delay:100ms] relative overflow-hidden max-w-[90%] mx-auto"
          style={{ minHeight: `${IFRAME_MIN_HEIGHT}px` }}
        >
          {/* Loading overlay — fully opaque to mask iframe white flash */}
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background transition-opacity duration-700"
            style={{
              opacity: ready ? 0 : 1,
              pointerEvents: ready ? "none" : "auto",
            }}
          >
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="size-10 border-3 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading calendar...
              </p>
            </div>
          </div>

          <iframe
            ref={iframeRef}
            src={iframeUrl.toString()}
            onLoad={handleLoad}
            className="transition-opacity duration-700"
            style={{
              width: "100%",
              border: "none",
              overflow: "hidden",
              minHeight: `${IFRAME_MIN_HEIGHT}px`,
              opacity: ready ? 1 : 0,
              visibility: ready ? "visible" : "hidden",
            }}
            scrolling="no"
            id="3kaQEdii0FF1El7xKgWY_1775158114885"
            title="Book a call with Market Stack"
          />
        </div>
        <Script
          src="https://link.marketstack.ai/js/form_embed.js"
          strategy="afterInteractive"
        />

        <Glow variant="bottom" className="opacity-40 scale-x-75 pointer-events-none" />
      </div>
      <Footer />
    </main>
  );
}
