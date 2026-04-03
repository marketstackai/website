"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/sections/navbar/default";
import Footer from "@/components/sections/footer/default";

function BookingContent() {
  // ref param preserved in URL for attribution tracking
  useSearchParams();

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-container mx-auto px-4 py-24">
        <iframe
          src="https://link.marketstack.ai/widget/booking/3kaQEdii0FF1El7xKgWY"
          style={{ width: "100%", border: "none", overflow: "hidden" }}
          scrolling="no"
          id="3kaQEdii0FF1El7xKgWY_1775158114885"
          title="Book a call with Market Stack"
        />
        <Script
          src="https://link.marketstack.ai/js/form_embed.js"
          strategy="afterInteractive"
        />
      </div>
      <Footer />
    </main>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="size-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-xl font-medium">Loading booking...</p>
            </div>
          </div>
          <Footer />
        </main>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
