"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ContactForm, ContactFormData } from "@/components/forms/contact-form";
import { ArrowRightIcon, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

function isGhlSyncEnabled() {
  if (process.env.NODE_ENV !== "development") {
    return true;
  }

  try {
    return localStorage.getItem("ms_ghl_enabled") === "true";
  } catch {
    return false;
  }
}

export default function AuditStartPage() {
  const router = useRouter();
  const [view, setView] = useState<"intro" | "contact">("intro");
  const [savedContact, setSavedContact] = useState<
    ContactFormData | undefined
  >();

  useEffect(() => {
    // Silently capture industry attribution from landing page links
    const params = new URLSearchParams(window.location.search);
    const industry = params.get("industry");
    if (industry) {
      try {
        sessionStorage.setItem("ms_industry", industry);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("ms_audit_contact");
    if (saved) {
      try {
        const parsed: ContactFormData = JSON.parse(saved);
        setSavedContact(parsed);
      } catch {
        /* ignore */
      }
      setView("contact");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const hasUtmsource = !!params.get("utm_source");
    setView(hasUtmsource ? "intro" : "contact");
  }, []);

  // Intercept browser back button if it tries to go back to the audit from the contact form
  useEffect(() => {
    const handlePopState = () => {
      // If the back button takes the user to an audit question instead of the homepage,
      // override it and force them to the home page as requested.
      if (
        window.location.pathname.startsWith("/audit") &&
        window.location.pathname !== "/audit/start"
      ) {
        window.location.href = "/";
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSuccess = (data: ContactFormData) => {
    try {
      sessionStorage.setItem("ms_audit_contact", JSON.stringify(data));
      sessionStorage.removeItem("ms_audit_step");
    } catch {
      // Ignore storage failures and continue the audit flow.
    }

    if (isGhlSyncEnabled()) {
      void fetch("/api/audit/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          company_name: data.company_name,
          sms_consent: data.sms_consent,
          marketing_consent: data.marketing_consent,
          source_industry: sessionStorage.getItem("ms_industry") ?? undefined,
          interest: sessionStorage.getItem("ms_interest") ?? undefined,
        }),
        keepalive: true,
      });
    }

    router.push("/audit");
  };

  return (
    <>
      <main className="bg-background text-foreground relative flex min-h-screen w-full flex-col overflow-hidden">
        <Section
          className={cn(
            "flex flex-1 flex-col items-center justify-center py-16 sm:py-20",
            view === "contact" && "px-4",
          )}
        >
          <div className="max-w-container relative z-10 mx-auto flex w-full flex-col items-center gap-8 px-4 text-center sm:pt-0">
            {/* View 'intro': Hero + Start button (UTM traffic only) */}
            {view === "intro" && (
              <>
                <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl">
                  Analyze your business for AI potential.
                </h1>
                <p className="text-md animate-appear text-muted-foreground max-w-3xl font-medium text-balance opacity-0 delay-100 sm:text-xl">
                  Discover where agentic workflows can eliminate bottlenecks and
                  recover leaking revenue — in under 5 minutes.
                </p>
                <div className="animate-appear mt-4 flex flex-col items-center gap-4 opacity-0 delay-200">
                  <Button size="lg" onClick={() => setView("contact")}>
                    Start the Audit
                    <ArrowRightIcon className="ml-2 size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground"
                    asChild
                  >
                    <Link href="/">
                      <ChevronLeftIcon className="mr-2" size={16} /> Back
                    </Link>
                  </Button>
                </div>
              </>
            )}

            {/* View 'contact': Contact form */}
            {view === "contact" && (
              <>
                <div className="w-full max-w-lg text-left">
                  <div className="mb-6">
                    <p className="text-muted-foreground font-medium text-balance opacity-80">
                      Discover where agentic workflows can eliminate bottlenecks
                      and recover leaking revenue — in under 5 minutes.
                    </p>
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
