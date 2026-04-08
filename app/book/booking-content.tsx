"use client";

import { useEffect, useRef, useState } from "react";
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
  const [ready, setReady] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(700);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // sessionStorage first, URL params as fallback (for direct/shared links)
  const stored = getBookingIntent();
  const interest =
    stored.interest ||
    searchParams.get("interest") ||
    searchParams.get("ref"); // legacy compat
  const source = stored.source || searchParams.get("source");

  const iframeUrl = new URL(
    "https://link.marketstack.ai/widget/booking/3kaQEdii0FF1El7xKgWY"
  );
  // Always attach UTMs for GHL attribution
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

  // form_embed.js is required for GHL custom CSS to apply inside the iframe.
  // Neutralize its scroll side-effects: kill scrollIntoView on the iframe
  // and revert any scrolling/overflow changes it makes.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.scrollIntoView = () => {};

    const observer = new MutationObserver(() => {
      if (iframe.style.overflow !== "hidden") {
        iframe.style.overflow = "hidden";
      }
      if (iframe.getAttribute("scrolling") !== "no") {
        iframe.setAttribute("scrolling", "no");
      }
    });
    observer.observe(iframe, {
      attributes: true,
      attributeFilter: ["style", "scrolling"],
    });
    return () => observer.disconnect();
  }, []);

  // Listen for GHL postMessage events (all messages are arrays: [type, ...args]).
  // "highlevel.setHeight" → update iframe height + reveal on first fire.
  // "set-sticky-contacts" + "_ud" → contact data including GHL contact ID.
  // "msgsndr-booking-complete" → booking confirmed, update interests.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!Array.isArray(e.data)) return;

      const type = String(e.data[0] ?? "");

      if (type === "highlevel.setHeight") {
        const h = (e.data[1] as { height?: number })?.height;
        if (typeof h === "number" && h > 0) {
          const scrollY = window.scrollY;
          document.documentElement.style.overflow = "hidden";
          setIframeHeight(h + 32);
          setTimeout(() => {
            document.documentElement.style.overflow = "";
            window.scrollTo(0, scrollY);
          }, 500);
        }
        setReady(true);
      }

      if (type === "set-sticky-contacts" && e.data[1] === "_ud") {
        try {
          const contact = JSON.parse(String(e.data[2]));
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
        }).catch(() => {
          // Non-critical — don't block the user
        });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [interest]);

  // Fallback: if highlevel.setHeight never fires, reveal after timeout.
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 4000);
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
          style={{ minHeight: `${iframeHeight}px` }}
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
            className="transition-opacity duration-700"
            style={{
              width: "100%",
              border: "none",
              height: `${iframeHeight}px`,
              opacity: ready ? 1 : 0,
              visibility: ready ? "visible" : "hidden",
              transition: "opacity 700ms",
              scrollMarginTop: "200px",
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
