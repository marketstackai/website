"use client";

import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { computeResults } from "@/lib/audit/engine";
import { getAllQuickWinsDebug } from "@/lib/audit/recommendations";
import type { QuizData, AdjustableParams } from "@/lib/audit/types";

import { QuizInputPanel } from "@/components/audit/dev/quiz-input-panel";
import { ScoreBreakdown } from "@/components/audit/dev/score-breakdown";
import { FlagsInspector } from "@/components/audit/dev/flags-inspector";
import { AllQuickWins } from "@/components/audit/dev/all-quick-wins";

import { RevenuLeakHero } from "@/components/audit/results/revenue-leak-hero";
import { AssumptionAdjuster } from "@/components/audit/results/assumption-adjuster";
import { TierAssessment } from "@/components/audit/results/tier-assessment";
import { QuickWinsSection } from "@/components/audit/results/quick-wins-section";
import { recalculate } from "@/lib/audit/engine";

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

export default function AuditDevPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [quizData, setQuizData] = useState<QuizData>(DEFAULT_QUIZ);

  const results = useMemo(() => computeResults(quizData), [quizData]);

  const allWins = useMemo(
    () => getAllQuickWinsDebug(quizData, {
      leads: results.leads,
      leakRate: results.leakRate,
      closeRate: results.closeRate,
      jobValue: results.jobValue,
    }, results.recommendedPackage),
    [quizData, results],
  );

  // Adjustable params for the production results components
  const defaults: AdjustableParams = {
    leads: results.leads,
    leakRate: results.leakRate,
    closeRate: results.closeRate,
    jobValue: results.jobValue,
  };
  const [adjParams, setParams] = useState<AdjustableParams>(defaults);

  // Reset params when quiz data changes
  const adjParamsKey = `${results.leads}-${results.leakRate}-${results.closeRate}-${results.jobValue}`;
  const [lastKey, setLastKey] = useState(adjParamsKey);
  if (adjParamsKey !== lastKey) {
    setParams(defaults);
    setLastKey(adjParamsKey);
  }

  const isAdjusted =
    adjParams.leads !== defaults.leads ||
    adjParams.leakRate !== defaults.leakRate ||
    adjParams.closeRate !== defaults.closeRate ||
    adjParams.jobValue !== defaults.jobValue;

  const adjusted = useMemo(() => recalculate(adjParams), [adjParams]);

  const displayMax = isAdjusted ? adjusted.maxImpactMonthly : results.maxImpactMonthly;
  const displayMaxAnnual = isAdjusted ? adjusted.maxImpactAnnual : results.maxImpactAnnual;
  const displayRealistic = isAdjusted ? adjusted.realisticMonthly : results.realisticMonthly;
  const displayRealisticAnnual = isAdjusted ? adjusted.realisticAnnual : results.realisticAnnual;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-amber-500/30 bg-amber-500/5 px-4 py-2 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Dev Sandbox — Audit Engine
          </span>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left: Input Panel */}
          <div className="lg:w-[380px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto border-r border-border p-5">
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
          <div className="flex-1 min-w-0 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6 pt-12 pb-24 space-y-10">
              <RevenuLeakHero
                maxImpactMonthly={displayMax}
                maxImpactAnnual={displayMaxAnnual}
                realisticMonthly={displayRealistic}
                realisticAnnual={displayRealisticAnnual}
                conservativeMonthly={results.conservativeMonthly}
                optimisticMonthly={results.optimisticMonthly}
                isAdjusted={isAdjusted}
                originalMaxImpact={results.maxImpactMonthly}
                isRevenueUndisclosed={results.isRevenueUndisclosed}
                isJobValueUndisclosed={results.isJobValueUndisclosed}
              />

              <AssumptionAdjuster
                params={adjParams}
                onChange={setParams}
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

              <TierAssessment
                tierLabel={results.tierLabel}
                tierText={results.tierText}
                hotLead={results.hotLead}
                aiReadiness={results.aiReadiness}
              />

              {/* DEV: All Quick Wins */}
              <AllQuickWins wins={allWins} />

              {/* Production quick wins (what the user sees) */}
              <QuickWinsSection quickWins={results.quickWins} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
