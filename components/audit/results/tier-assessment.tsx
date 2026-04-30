"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
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

const SCORE_STYLE = {
  Low: {
    text: "text-orange-500",
    nodeBg: "bg-orange-500",
    lineBg: "bg-orange-500/50",
    bulletBg: "bg-orange-500",
    boxBg: "bg-orange-500/8",
    boxBorder: "border-orange-500/30",
    badgeClass: "border-orange-500/50 text-orange-500 bg-orange-500/5",
  },
  Moderate: {
    text: "text-brand",
    nodeBg: "bg-brand",
    lineBg: "bg-brand/50",
    bulletBg: "bg-brand",
    boxBg: "bg-brand/8",
    boxBorder: "border-brand/30",
    badgeClass: "border-brand/50 text-brand bg-brand/5",
  },
  High: {
    text: "text-green-500",
    nodeBg: "bg-green-500",
    lineBg: "bg-green-500/50",
    bulletBg: "bg-green-500",
    boxBg: "bg-green-500/8",
    boxBorder: "border-green-500/30",
    badgeClass: "border-green-500/50 text-green-500 bg-green-500/5",
  },
} as const;

const BULLETS: Record<"Low" | "Moderate" | "High", string[]> = {
  Low: [
    "Establish consistent lead capture and CRM hygiene before adding AI layers.",
    "Manual automation (sequences, pipelines) will deliver faster ROI right now.",
    "Revisit AI deployment once core response gaps are closed.",
  ],
  Moderate: [
    "Your infrastructure supports automated follow-up and intake workflows.",
    "Layering in conversational AI to capture missed revenue at scale.",
    "Avoid over-engineering; targeted automation will outperform broad AI rollouts.",
  ],
  High: [
    "Agentic workflows and AI-assisted decision-making are within reach now.",
    "You're primed for custom AI agents that operate with minimal supervision.",
    "Focus on compounding: AI that improves as it learns from your pipeline data.",
  ],
};

const STEPS = ["Low", "Moderate", "High"] as const;
const STEP_INDEX: Record<string, number> = { Low: 0, Moderate: 1, High: 2 };

export function TierAssessment({
  tierLabel,
  aiReadiness,
}: TierAssessmentProps) {
  if (!aiReadiness?.score) return null;

  const style = SCORE_STYLE[aiReadiness.score];
  const bullets = BULLETS[aiReadiness.score];
  const activeIndex = STEP_INDEX[aiReadiness.score] ?? 0;

  return (
    <div className="animate-appear delay-200 w-full mb-12">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 space-y-8">

          {/* Stage */}
          <div className="space-y-2 text-left">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-brand">{tierLabel} Stage</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {TIER_DESCRIPTIONS[tierLabel]}
            </p>
          </div>

          {/* AI Readiness */}
          <div className="space-y-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                AI Readiness
              </span>
              <Badge
                variant="outline"
                className={`text-xs font-bold px-3 py-1 ${style.badgeClass}`}
              >
                {aiReadiness.score}
              </Badge>
            </div>

            {/* 3-step gauge */}
            <div className="flex items-start gap-0">
              {STEPS.map((step, i) => {
                const isActive = i <= activeIndex;
                const isLineActive = i < activeIndex;
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
                      <div
                        className={`size-3 rounded-full transition-colors ${
                          isActive ? style.nodeBg : "bg-muted-foreground/20"
                        }`}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          isActive ? style.text : "text-muted-foreground/30"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px mt-1.5 mx-3 rounded-full ${
                          isLineActive ? style.lineBg : "bg-muted-foreground/15"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              {aiReadiness.description}
            </p>

            <div className={`rounded-lg border p-5 space-y-3 ${style.boxBg} ${style.boxBorder}`}>
              <p className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
                What this means for you
              </p>
              <ul className="space-y-2.5">
                {bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className={`mt-2 size-1.5 rounded-full flex-shrink-0 ${style.bulletBg}`} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategic Goal */}
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
