"use client";

import React from "react";
import type { TierLabel } from "@/lib/audit/types";

interface TierAssessmentProps {
  tierLabel: TierLabel;
  tierText?: string;
  hotLead?: boolean;
  aiReadiness: {
    score: "Low" | "Moderate" | "High";
    description: string;
  };
}

const TIER_DESCRIPTIONS: Record<TierLabel, string> = {
  Foundation: "Small, strategic changes to capture leads will have massive impact. You're leaving the most money on the table from basic response gaps.",
  Growth: "Your volume is outstripping your infrastructure. Automation isn't optional anymore — it's the difference between scaling and stalling.",
  Optimization: "You have the volume and the systems. Bespoke AI workflows will turn your stack into a compounding revenue engine.",
};


export function TierAssessment({
  tierLabel,
  aiReadiness,
}: TierAssessmentProps) {
  if (!aiReadiness?.score) return null;
  return (
    <div className="animate-appear delay-200 w-full mb-12">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 space-y-8">
          <div className="space-y-2 text-left">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-brand">{tierLabel} Stage</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {TIER_DESCRIPTIONS[tierLabel]}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-border">
            <div className="space-y-1">
              <div className="flex items-center h-6">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Strategic Goal</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tierLabel === "Foundation" && "Establish robust lead capture and professional follow-up systems to stabilize the base."}
                {tierLabel === "Growth" && "Leverage automation to scale lead handling capacity without increasing administrative overhead."}
                {tierLabel === "Optimization" && "Deploy integrated AI agents and bespoke workflows to maximize lead value and operational efficiency."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
