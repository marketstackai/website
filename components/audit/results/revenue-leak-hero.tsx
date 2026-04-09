"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RevenuLeakHeroProps {
  maxImpactMonthly: number;
  maxImpactAnnual: number;
  realisticMonthly: number;
  realisticAnnual: number;
  conservativeMonthly: number;
  optimisticMonthly: number;
  isAdjusted?: boolean;
  originalMaxImpact?: number;
  isRevenueUndisclosed: boolean;
  isJobValueUndisclosed: boolean;
}

function useCountUp(target: number, duration = 1500): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(target * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return current;
}

export function RevenuLeakHero({
  maxImpactMonthly,
  maxImpactAnnual,
  realisticMonthly,
  realisticAnnual,
  conservativeMonthly,
  optimisticMonthly,
  isRevenueUndisclosed,
  isJobValueUndisclosed,
}: RevenuLeakHeroProps) {
  const animatedMax = useCountUp(Math.round(maxImpactMonthly));

  return (
    <div className="text-center space-y-8 animate-appear">
      <Badge variant="outline" className="mb-4">
        <ShieldAlert className="size-3 mr-2 text-brand" />
        <span className="text-muted-foreground">Audit Complete</span>
      </Badge>

      {(isRevenueUndisclosed || isJobValueUndisclosed) && (
        <div className="max-w-xl mx-auto p-4 bg-muted/30 border border-border rounded-xl text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-500">
          <p className="flex items-center justify-center gap-2">
            <span className="font-bold text-foreground">Note:</span> 
            Since your {isRevenueUndisclosed && isJobValueUndisclosed ? "revenue and job value were" : isRevenueUndisclosed ? "revenue was" : "job value was"} not disclosed, we utilized industry benchmarks to provide these estimates.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h1 className="text-lg sm:text-xl text-muted-foreground font-medium uppercase tracking-widest">
          Estimated Monthly Revenue at Risk
        </h1>

        <div className="relative inline-block group">
          <div className="absolute -inset-8 bg-brand/20 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
          <span className="text-6xl sm:text-8xl font-bold text-brand tabular-nums tracking-tighter relative">
            ${animatedMax.toLocaleString()}
          </span>
        </div>


        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance pt-2">
          That&apos;s up to <strong className="text-foreground">${Math.round(maxImpactAnnual).toLocaleString()}</strong> per year if every missed lead had converted.
        </p>

        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground/70 pt-1">
          <span>Conservative: ${Math.round(conservativeMonthly).toLocaleString()}/mo</span>
          <span className="text-muted-foreground/30">|</span>
          <span>Optimistic: ${Math.round(optimisticMonthly).toLocaleString()}/mo</span>
        </div>

        <div className="max-w-md mx-auto pt-4 space-y-1">
          <div className="bg-card/50 border rounded-xl px-5 py-3 text-center">
            <span className="text-sm text-muted-foreground">With Close Rate Factor: </span>
            <span className="text-lg font-semibold text-foreground">
              ${Math.round(realisticMonthly).toLocaleString()}/mo
            </span>
            <span className="text-sm text-muted-foreground">
              {" "}(${Math.round(realisticAnnual).toLocaleString()}/yr)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
