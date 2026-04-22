"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ContactForm, ContactFormData } from "@/components/forms/contact-form";
import { ArrowRightIcon, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { GHLTracker } from "@/components/ghl-tracker";

import { cn } from "@/lib/utils";

export default function AuditStartPage() {
  const router = useRouter();
  const [view, setView] = useState<0 | 1>(0);
  const [savedContact, setSavedContact] = useState<ContactFormData | undefined>();

  useEffect(() => {
    const saved = sessionStorage.getItem("ms_audit_contact");
    if (saved) {
      try {
        const parsed: ContactFormData = JSON.parse(saved);
        setSavedContact(parsed);
      } catch { /* ignore */ }
      setView(1);
      return;
    }

    const isInternal =
      document.referrer.includes("marketstack.ai") ||
      document.referrer.includes("localhost");
    setView(isInternal ? 1 : 0);
  }, []);

  // Intercept browser back button if it tries to go back to the audit from the contact form
  useEffect(() => {
    const handlePopState = () => {
      // If the back button takes the user to an audit question instead of the homepage,
      // override it and force them to the home page as requested.
      if (window.location.pathname.startsWith("/audit") && window.location.pathname !== "/audit/start") {
        window.location.href = "/";
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSuccess = (data: ContactFormData) => {
    sessionStorage.setItem("ms_audit_contact", JSON.stringify(data));
    sessionStorage.removeItem("ms_audit_step");
    router.push("/audit");
  };

  return (
    <>
      <GHLTracker />
      <main className="min-h-screen w-full bg-background text-foreground flex flex-col relative overflow-hidden">
        <Section className={cn("flex-1 flex flex-col items-center sm:justify-center pt-16 sm:pt-0", view === 0 ? "justify-center" : "px-4")}>
          <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center px-4 relative z-10 w-full sm:pt-0">

            {/* View 0: Hero + Start button (external traffic only) */}
            {view === 0 && (
              <>
                <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl">
                  Find out where you&apos;re leaking revenue — in under 5 minutes.
                </h1>
                <p className="text-md animate-appear text-muted-foreground max-w-3xl font-medium text-balance opacity-0 delay-100 sm:text-xl">
                  Answer a few questions about your business and we&apos;ll show you exactly how much revenue your current systems are leaving on the table — and what to fix first.
                </p>
                <div className="animate-appear opacity-0 delay-200 flex flex-col items-center gap-4 mt-4">
                  <Button size="lg" onClick={() => setView(1)}>
                    Start the Audit
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground" asChild>
                    <Link href="/"><ChevronLeftIcon className="mr-2" size={16} /> Back</Link>
                  </Button>
                </div>
              </>
            )}

            {/* View 1: Contact form */}
            {view === 1 && (
              <>
                <div className="w-full max-w-lg text-left">
                  <div className="mb-6">
                    <h1 className="text-3xl font-semibold mb-2 text-balance">Let&apos;s start with you.</h1>
                    <p className="text-muted-foreground font-medium opacity-80 text-balance">So we can send your personalized report.</p>
                  </div>
                  <ContactForm
                    onSuccess={handleSuccess}
                    initialValues={savedContact}
                  />
                </div>
              </>
            )}

          </div>
        </Section>
      </main>
    </>
  );
}
