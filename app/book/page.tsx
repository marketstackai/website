import { Suspense } from "react";
import Navbar from "@/components/sections/navbar/default";
import Footer from "@/components/sections/footer/default";
import BookingContent from "./booking-content";

export const metadata = {
  title: "Book a Call",
  description:
    "Schedule a discovery call with Market Stack to discuss AI-powered systems for your business.",
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
          <Navbar />
          <div className="flex-1 w-full max-w-container mx-auto px-4 pt-32 pb-24">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
                Book a Call
              </h1>
              <p className="text-muted-foreground text-lg">
                Pick a time that works for you. We&apos;ll handle the rest.
              </p>
            </div>
            <div className="rounded-2xl max-w-[90%] mx-auto">
              <div
                className="flex items-center justify-center"
                style={{ minHeight: "700px" }}
              >
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="size-10 border-3 border-brand border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Loading calendar...
                  </p>
                </div>
              </div>
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
