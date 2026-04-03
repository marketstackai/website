"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { computeResults } from "@/lib/audit/engine";
import type { AuditResults } from "@/lib/audit/types";
import { AuditResultsView } from "@/components/audit/results";

// Bump this when computeResults output shape or values change materially
const CACHE_VERSION = 1;

type ReportState =
  | { status: "loading" }
  | { status: "ready"; results: AuditResults; email: string }
  | { status: "error"; message: string };

function ReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [state, setState] = useState<ReportState>({ status: "loading" });

  useEffect(() => {
    if (!id) {
      router.replace("/audit/start");
      return;
    }

    // 1. Check sessionStorage cache (instant for fresh completions)
    const cached = sessionStorage.getItem(`ms_audit_report_${id}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.version !== CACHE_VERSION) {
          sessionStorage.removeItem(`ms_audit_report_${id}`);
        } else {
          const { results, email } = parsed;
          if (results.aiReadiness) {
            setState({ status: "ready", results, email });
            return;
          }
        }
      } catch {
        /* cache corrupted, fall through to API */
      }
    }

    // 2. Fetch from GHL via API
    async function fetchReport() {
      try {
        const res = await fetch(`/api/audit/report?id=${encodeURIComponent(id!)}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          if (res.status === 404) {
            setState({ status: "error", message: "Report not found. It may have expired or the link is invalid." });
          } else {
            setState({ status: "error", message: data.error ?? "Failed to load report." });
          }
          return;
        }

        const results = computeResults(data.quizData);

        // Cache for this session
        sessionStorage.setItem(
          `ms_audit_report_${id}`,
          JSON.stringify({ version: CACHE_VERSION, results, email: data.email }),
        );

        setState({ status: "ready", results, email: data.email });
      } catch {
        setState({ status: "error", message: "Could not connect to the server." });
      }
    }

    fetchReport();
  }, [id, router]);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-medium">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-semibold">{state.message}</h1>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/audit/start";
            }}
            className="text-brand font-medium hover:underline underline-offset-4 cursor-pointer"
          >
            Start a new audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuditResultsView
      results={state.results}
      email={state.email}
      onStartOver={() => {
        sessionStorage.removeItem("ms_audit_contact");
        sessionStorage.removeItem("ms_audit_step");
        window.location.href = "/audit/start";
      }}
    />
  );
}

export default function AuditReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="size-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-xl font-medium">Loading your report...</p>
          </div>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
