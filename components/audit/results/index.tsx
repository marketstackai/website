"use client";

import React, { useState, useMemo } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RevenuLeakHero } from "./revenue-leak-hero";
import { AssumptionAdjuster } from "./assumption-adjuster";
import { AIReadinessCard } from "./ai-readiness-card";
import { QuickWinsSection } from "./quick-wins-section";
import { CTAFooter } from "./cta-footer";
import { recalculate } from "@/lib/audit/engine";
import type { AuditResults, AdjustableParams } from "@/lib/audit/types";

interface AuditResultsViewProps {
  results: AuditResults;
  email: string;
  onStartOver: () => void;
}

export function AuditResultsView({ results, email, onStartOver }: AuditResultsViewProps) {
  const defaults: AdjustableParams = {
    leads: results.leads ?? 0,
    leakRate: results.leakRate ?? 0,
    jobValue: results.jobValue ?? 0,
  };

  const [params, setParams] = useState<AdjustableParams>(defaults);

  const isAdjusted =
    params.leads !== defaults.leads ||
    params.leakRate !== defaults.leakRate ||
    params.jobValue !== defaults.jobValue;

  const adjusted = useMemo(
    () => recalculate(params),
    [params],
  );

  const displayMax = isAdjusted ? adjusted.maxImpactMonthly : results.maxImpactMonthly;
  const displayMaxAnnual = isAdjusted ? adjusted.maxImpactAnnual : results.maxImpactAnnual;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-background text-foreground pb-24 overflow-x-hidden">
        <div className="fixed inset-0 bg-brand/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-24 space-y-10 relative z-10">
          <RevenuLeakHero
            maxImpactMonthly={displayMax}
            maxImpactAnnual={displayMaxAnnual}
            isAdjusted={isAdjusted}
            originalMaxImpact={results.maxImpactMonthly}
            isRevenueUndisclosed={results.isRevenueUndisclosed}
            isJobValueUndisclosed={results.isJobValueUndisclosed}
          />

          <AssumptionAdjuster
            params={params}
            onReset={() => setParams(defaults)}
            onUpdateParam={(key, val) => setParams(prev => ({ ...prev, [key]: val }))}
            isAdjusted={isAdjusted}
          />

          {results.aiReadiness?.score && (
            <AIReadinessCard
              score={results.aiReadiness.score}
              tierLabel={results.tierLabel}
            />
          )}

          <QuickWinsSection quickWins={results.quickWins} />

          <CTAFooter
            recommendedPackage={results.recommendedPackage}
            tierLabel={results.tierLabel}
            email={email}
            onStartOver={onStartOver}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
