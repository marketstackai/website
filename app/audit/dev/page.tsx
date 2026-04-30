"use client";

import { useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { Mail, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { computeResults, recalculate } from "@/lib/audit/engine";
import { buildAuditEmail, type AuditEmailData } from "@/lib/audit/email";
import { getAllQuickWinsDebug } from "@/lib/audit/recommendations";
import type { QuizData, AdjustableParams } from "@/lib/audit/types";
import { cn } from "@/lib/utils";

import { QuizInputPanel } from "@/components/audit/dev/quiz-input-panel";
import { ScoreBreakdown } from "@/components/audit/dev/score-breakdown";
import { FlagsInspector } from "@/components/audit/dev/flags-inspector";
import { AllQuickWins } from "@/components/audit/dev/all-quick-wins";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import { RevenuLeakHero } from "@/components/audit/results/revenue-leak-hero";
import { AssumptionAdjuster } from "@/components/audit/results/assumption-adjuster";
import { AIReadinessCard } from "@/components/audit/results/ai-readiness-card";
import { QuickWinsSection } from "@/components/audit/results/quick-wins-section";
const DEFAULT_QUIZ: QuizData = {
  industry: "home_services",
  industry_other: "",
  team_size: "12",
  monthly_revenue: "175000",
  avg_job_value: "6000",
  monthly_leads: "50",
  biggest_challenges: ["missed_leads", "manual_tasks"],
  lead_response: "voicemail",
  ai_experience: "ai_some_results",
  ai_detail: "",
  urgency: "urgent",
  additional_notes: "",
};

const PRESETS: Record<string, QuizData> = {
  "High-Value Home Services": {
    industry: "home_services", industry_other: "", team_size: "25",
    monthly_revenue: "500000", avg_job_value: "8000", monthly_leads: "80",
    biggest_challenges: ["missed_leads", "manual_tasks"], lead_response: "voicemail",
    ai_experience: "ai_some_results", ai_detail: "", urgency: "urgent", additional_notes: "",
  },
  "New E-Commerce": {
    industry: "ecom", industry_other: "", team_size: "5",
    monthly_revenue: "50000", avg_job_value: "250", monthly_leads: "300",
    biggest_challenges: ["pipeline_stuck"], lead_response: "auto_response",
    ai_experience: "no_ai", ai_detail: "", urgency: "exploring", additional_notes: "",
  },
  "Enterprise Tech": {
    industry: "tech", industry_other: "", team_size: "200",
    monthly_revenue: "500000", avg_job_value: "5000", monthly_leads: "100",
    biggest_challenges: ["tool_disconnect"], lead_response: "ai_system",
    ai_experience: "ai_advanced", ai_detail: "", urgency: "1_3_months", additional_notes: "",
  },
  "Foundation (Min)": {
    industry: "other", industry_other: "", team_size: "1",
    monthly_revenue: "undisclosed", avg_job_value: "undisclosed", monthly_leads: "not_sure",
    biggest_challenges: ["unsure_ai"], lead_response: "voicemail",
    ai_experience: "no_ai", ai_detail: "", urgency: "exploring", additional_notes: "",
  },
};

function buildEmailPreviewHtml(data: AuditEmailData): string {
  const scrollbarStyles = `<style>
html,body{scrollbar-width:none;-ms-overflow-style:none;}
html::-webkit-scrollbar,body::-webkit-scrollbar,*::-webkit-scrollbar{width:0;height:0;display:none;}
</style>`;

  return buildAuditEmail(data).replace("</head>", `${scrollbarStyles}</head>`);
}

export default function AuditDevPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [quizData, setQuizData] = useState<QuizData>(DEFAULT_QUIZ);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  const results = useMemo(() => computeResults(quizData), [quizData]);

  const emailData = useMemo<AuditEmailData>(() => ({
    firstName: "Teddy",
    tierLabel: results.tierLabel,
    totalScore: results.totalScore,
    maxImpactMonthly: results.maxImpactMonthly,
    maxImpactAnnual: results.maxImpactAnnual,
    recommendedPackage: results.recommendedPackage,
    aiReadinessScore: results.aiReadiness.score,
    aiReadinessDescription: results.aiReadiness.description,
    leads: results.leads,
    leakRate: results.leakRate,
    quickWins: results.quickWins.slice(0, 1).map((win) => ({
      title: win.title,
      recoveredMonthly: win.recoveredMonthly,
    })),
    reportUrl: "/audit/report?id=preview",
  }), [results]);

  const emailHtml = useMemo(() => buildEmailPreviewHtml(emailData), [emailData]);

  const allWins = useMemo(
    () => getAllQuickWinsDebug(quizData, {
      leads: results.leads,
      leakRate: results.leakRate,
      jobValue: results.jobValue,
    }, results.recommendedPackage),
    [quizData, results],
  );

  // Adjustable params for the production results components
  const defaults: AdjustableParams = {
    leads: results.leads,
    leakRate: results.leakRate,
    jobValue: results.jobValue,
  };
  const [adjParams, setParams] = useState<AdjustableParams>(defaults);

  // Reset params when quiz data changes
  const adjParamsKey = `${results.leads}-${results.leakRate}-${results.jobValue}`;
  const [lastKey, setLastKey] = useState(adjParamsKey);
  if (adjParamsKey !== lastKey) {
    setParams(defaults);
    setLastKey(adjParamsKey);
  }

  const isAdjusted =
    adjParams.leads !== defaults.leads ||
    adjParams.leakRate !== defaults.leakRate ||
    adjParams.jobValue !== defaults.jobValue;

  const adjusted = useMemo(() => recalculate(adjParams), [adjParams]);

  const displayMax = isAdjusted ? adjusted.maxImpactMonthly : results.maxImpactMonthly;
  const displayMaxAnnual = isAdjusted ? adjusted.maxImpactAnnual : results.maxImpactAnnual;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-50 flex h-11 items-center justify-between border-b border-amber-500/30 bg-background/80 px-4 backdrop-blur-md">
          <div className="flex flex-1 items-center gap-2">
            <ThemeToggle type="dropdown" />
          </div>
          
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">
            Dev Sandbox &mdash; Audit Engine
          </span>

          <div className="flex flex-1 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEmailPreviewOpen((open) => !open)}
              className="h-7 border-amber-500/30 bg-background/70 px-2.5 text-[10px] font-bold uppercase tracking-widest text-amber-500 shadow-none hover:bg-amber-500/10 hover:text-amber-400"
              aria-pressed={isEmailPreviewOpen}
            >
              {isEmailPreviewOpen ? (
                <PanelRightClose className="mr-1.5 size-3.5" />
              ) : (
                <Mail className="mr-1.5 size-3.5" />
              )}
              {isEmailPreviewOpen ? "Hide Email" : "Preview Email"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left: Input Panel */}
          <div className="lg:w-[380px] lg:shrink-0 lg:sticky lg:top-11 lg:h-[calc(100vh-2.75rem)] lg:overflow-y-auto border-r border-border p-5">
            <QuizInputPanel
              data={quizData}
              onChange={setQuizData}
              onReset={() => setQuizData(DEFAULT_QUIZ)}
              onPreset={(name) => {
                if (PRESETS[name]) setQuizData(PRESETS[name]);
              }}
            />
          </div>

          {/* Right: Results */}
          <div className="flex min-w-0 flex-1 flex-col xl:flex-row">
            <div className="min-w-0 flex-1 overflow-x-hidden">
              <div className={cn("mx-auto max-w-4xl px-6 pt-12 pb-24 space-y-10", isEmailPreviewOpen && "xl:px-5")}>
                <RevenuLeakHero
                  maxImpactMonthly={displayMax}
                  maxImpactAnnual={displayMaxAnnual}
                  isAdjusted={isAdjusted}
                  originalMaxImpact={results.maxImpactMonthly}
                  isRevenueUndisclosed={results.isRevenueUndisclosed}
                  isJobValueUndisclosed={results.isJobValueUndisclosed}
                />

                <AssumptionAdjuster
                  params={adjParams}
                  onReset={() => setParams(defaults)}
                  onUpdateParam={(key, val) => setParams(prev => ({ ...prev, [key]: val }))}
                  isAdjusted={isAdjusted}
                />

                {/* DEV: Score Breakdown */}
                <ScoreBreakdown
                  data={quizData}
                  totalScore={results.totalScore}
                  tierLabel={results.tierLabel}
                />

                {/* DEV: Flags */}
                <FlagsInspector results={results} data={quizData} />

                {results.aiReadiness?.score && (
                  <AIReadinessCard
                    score={results.aiReadiness.score}
                    tierLabel={results.tierLabel}
                  />
                )}

                {/* DEV: All Quick Wins */}
                <AllQuickWins wins={allWins} />

                {/* Production quick wins (what the user sees) */}
                <QuickWinsSection quickWins={results.quickWins} />
              </div>
            </div>

            {isEmailPreviewOpen && (
              <aside
                className="border-t border-border bg-muted/10 p-4 xl:sticky xl:top-11 xl:h-[calc(100vh-2.75rem)] xl:w-[440px] xl:shrink-0 xl:overflow-hidden xl:border-l xl:border-t-0 2xl:w-[500px]"
                aria-label="Audit email preview"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
                  <div className="border-b border-border bg-card px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Email Preview
                        </p>
                        <p className="truncate text-sm font-semibold text-foreground">
                          Your AI Readiness Report
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="min-h-[720px] flex-1 bg-[#09090b] p-3 xl:min-h-0">
                    <iframe
                      title="Audit results email preview"
                      srcDoc={emailHtml}
                      className="h-[720px] w-full rounded-md border border-border bg-[#09090b] xl:h-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
