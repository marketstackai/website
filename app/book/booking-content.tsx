"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/sections/navbar/default";
import Footer from "@/components/sections/footer/default";
import Glow from "@/components/ui/glow";
import { getBookingIntent, INTEREST_SUBHEADINGS } from "@/lib/booking";

const DEFAULT_SUBHEADING =
  "Pick a time that works for you. We\u2019ll handle the rest.";

export default function BookingContent() {
  const searchParams = useSearchParams();

  // Resolved once on mount from sessionStorage + searchParams.
  // Stored in refs so the iframe URL never changes after first render.
  const interestRef = useRef<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [subheading, setSubheading] = useState(DEFAULT_SUBHEADING);

  useEffect(() => {
    const intent = getBookingIntent();
    const storedIndustry = (() => { try { return sessionStorage.getItem("ms_industry"); } catch { return null; } })();

    const resolvedInterest = intent.interest || searchParams.get("interest") || searchParams.get("ref");
    const resolvedSource = intent.source || searchParams.get("source");
    const resolvedIndustry = storedIndustry || searchParams.get("industry");

    interestRef.current = resolvedInterest;

    if (resolvedInterest && INTEREST_SUBHEADINGS[resolvedInterest as keyof typeof INTEREST_SUBHEADINGS]) {
      setSubheading(INTEREST_SUBHEADINGS[resolvedInterest as keyof typeof INTEREST_SUBHEADINGS]);
    }

    const url = new URL("https://link.marketstack.ai/widget/booking/3kaQEdii0FF1El7xKgWY");
    url.searchParams.set("utm_source", "marketstack.ai");
    url.searchParams.set("utm_medium", "website");
    if (resolvedInterest) {
      url.searchParams.set("utm_content", resolvedInterest);
      url.searchParams.set("interest", resolvedInterest);
    }
    if (resolvedSource) url.searchParams.set("utm_campaign", resolvedSource);
    if (resolvedIndustry) url.searchParams.set("industry", resolvedIndustry);

    setIframeUrl(url.toString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const taggedRef = useRef(false);
  const contactIdRef = useRef<string | null>(null);

  // Patch GHL scroll APIs as no-ops before form_embed.js loads.
  // The container jump is prevented by overflow:clip on the outer div, but GHL
  // also calls window.scrollTo(0,0) on transition — block that too.
  useLayoutEffect(() => {
    const origScrollTo = window.scrollTo.bind(window);
    const origScrollBy = window.scrollBy.bind(window);
    const origScrollIntoView = Element.prototype.scrollIntoView;

    window.scrollTo = (() => {}) as typeof window.scrollTo;
    window.scroll = (() => {}) as typeof window.scroll;
    window.scrollBy = (() => {}) as typeof window.scrollBy;
    Element.prototype.scrollIntoView = function () {};

    return () => {
      window.scrollTo = origScrollTo;
      window.scroll = origScrollTo as typeof window.scroll;
      window.scrollBy = origScrollBy;
      Element.prototype.scrollIntoView = origScrollIntoView;
    };
  }, []);

  // Listen for GHL postMessage events for contact tracking only.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!Array.isArray(e.data)) return;
      const type = String(e.data[0] ?? "");

      if (type === "set-sticky-contacts" && e.data[1] === "_ud") {
        try {
          const rawData = e.data[2];
          const contact = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
          if (typeof contact.id === "string" && contact.id.length > 0) {
            contactIdRef.current = contact.id;
          }
        } catch {
          // malformed payload — ignore
        }
      }

      if (
        type === "msgsndr-booking-complete" &&
        !taggedRef.current &&
        interestRef.current &&
        contactIdRef.current
      ) {
        taggedRef.current = true;
        const sourceIndustry = (() => { try { return sessionStorage.getItem("ms_industry") ?? undefined; } catch { return undefined; } })();
        fetch("/api/booking/interest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactId: contactIdRef.current, interest: interestRef.current, source_industry: sourceIndustry }),
        }).catch(() => {});
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-container mx-auto px-4 pt-32 pb-24 relative" style={{ overflow: "clip" }}>
        <div className="text-center mb-6 animate-appear">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
            Book a Call
          </h1>
          <p className="text-muted-foreground text-lg max-w-[540px] mx-auto text-balance">
            {subheading}
          </p>
        </div>

        <div
          className="relative rounded-2xl animate-appear [animation-delay:100ms] max-w-[90%] mx-auto"
          style={{ height: "800px", overflow: "clip" }}
        >
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              id="3kaQEdii0FF1El7xKgWY_1775158114885"
              title="Book a call with Market Stack"
            />
          )}
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
