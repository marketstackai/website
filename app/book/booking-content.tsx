"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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

  const stored = getBookingIntent();
  const interest =
    stored.interest ||
    searchParams.get("interest") ||
    searchParams.get("ref");
  const source = stored.source || searchParams.get("source");

  const iframeUrl = new URL(
    "https://link.marketstack.ai/widget/booking/3kaQEdii0FF1El7xKgWY"
  );
  iframeUrl.searchParams.set("utm_source", "marketstack.ai");
  iframeUrl.searchParams.set("utm_medium", "website");
  if (interest) {
    iframeUrl.searchParams.set("utm_content", interest);
    iframeUrl.searchParams.set("interest", interest);
  }
  if (source) iframeUrl.searchParams.set("utm_campaign", source);

  const subheading =
    (interest &&
      INTEREST_SUBHEADINGS[interest as keyof typeof INTEREST_SUBHEADINGS]) ||
    DEFAULT_SUBHEADING;

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
        interest &&
        contactIdRef.current
      ) {
        taggedRef.current = true;
        fetch("/api/booking/interest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactId: contactIdRef.current, interest }),
        }).catch(() => {});
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [interest]);

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
          <iframe
            src={iframeUrl.toString()}
            style={{ width: "100%", height: "100%", border: "none" }}
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
