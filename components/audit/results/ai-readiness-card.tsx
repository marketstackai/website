"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { TIER_DESCRIPTIONS } from "@/lib/audit/display";
import type { TierLabel } from "@/lib/audit/types";
import { Target } from "lucide-react";

interface AIReadinessCardProps {
  score: "Low" | "Moderate" | "High";
  tierLabel: TierLabel;
}

const SCORE_STYLE = {
  Low: {
    text: "text-orange-500",
    nodeBg: "bg-orange-500",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.4)]",
    bulletBg: "bg-orange-500",
    boxBg: "bg-orange-500/8",
    boxBorder: "border-orange-500/30",
    badgeClass: "border-orange-500/50 text-orange-500 bg-orange-500/5",
  },
  Moderate: {
    text: "text-brand",
    nodeBg: "bg-brand",
    glow: "shadow-[0_0_20px_hsla(var(--brand),0.4)]",
    bulletBg: "bg-brand",
    boxBg: "bg-brand/8",
    boxBorder: "border-brand/30",
    badgeClass: "border-brand/50 text-brand bg-brand/5",
  },
  High: {
    text: "text-green-500",
    nodeBg: "bg-green-500",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]",
    bulletBg: "bg-green-500",
    boxBg: "bg-green-500/8",
    boxBorder: "border-green-500/30",
    badgeClass: "border-green-500/50 text-green-500 bg-green-500/5",
  },
} as const;

const BULLETS: Record<"Low" | "Moderate" | "High", string[]> = {
  Low: [
    "Establish consistent lead capture and CRM hygiene before adding AI layers.",
    "Simple automation (sequences, pipelines) will deliver faster ROI right now.",
    "Revisit AI deployment once core response gaps are closed.",
  ],
  Moderate: [
    "Implement automated follow-up and intake workflows.",
    "Start with conversational AI — highest leverage, lowest risk.",
    "Avoid over-engineering; targeted automation will outperform broad AI rollouts.",
  ],
  High: [
    "Build agentic workflows and ai infrastructure now.",
    "Deploy custom agents that operate with minimal supervision.",
    "Focus on compounding: AI that improves as it learns from your pipeline data.",
  ],
};

const STEPS = ["Low", "Moderate", "High"] as const;
const STEP_INDEX: Record<string, number> = { Low: 0, Moderate: 1, High: 2 };

export function AIReadinessCard({ score, tierLabel }: AIReadinessCardProps) {
  const style = SCORE_STYLE[score];
  const bullets = BULLETS[score];
  const activeIndex = STEP_INDEX[score] ?? 0;

  return (
    <div className="animate-appear delay-300 w-full mb-12">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden relative">
        {/* Subtle background glow based on score */}
        <div className={`absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full opacity-20 blur-3xl pointer-events-none ${style.nodeBg}`} />
        
        <div className="p-6 sm:p-10 space-y-10 relative z-10">

          {/* AI Readiness Focal Point */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-6">
              <span className="text-sm sm:text-base font-bold uppercase tracking-widest text-muted-foreground block">
                AI Readiness Score
              </span>
              <div className="flex items-center gap-4">
                <span className={`text-5xl sm:text-7xl font-bold tracking-tight ${style.text}`}>
                  {score}
                </span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full flex items-center gap-2 sm:gap-3">
              {STEPS.map((step, i) => {
                const isActive = i <= activeIndex;
                const isCurrent = i === activeIndex;
                return (
                  <div key={step} className="flex-1 flex flex-col gap-2.5">
                    <div
                      className={`h-2 sm:h-2.5 w-full rounded-full transition-all duration-700 ${
                        isActive
                          ? `${style.nodeBg} ${isCurrent ? style.glow : "opacity-30"}`
                          : "bg-muted-foreground/15"
                      }`}
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-500 ${
                        isActive ? (isCurrent ? style.text : `${style.text} opacity-50`) : "text-muted-foreground/30"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What this means bullets */}
          <div className={`rounded-lg border p-5 sm:p-6 space-y-4 ${style.boxBg} ${style.boxBorder}`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>
                Your Next Steps
              </p>
              <Badge
                variant="outline"
                className={`text-xs font-bold px-3 py-1 ${style.badgeClass}`}
              >
                {activeIndex === 0 ? "Action Required" : activeIndex === 1 ? "Ready to Build" : "Primed for Scale"}
              </Badge>
            </div>
            <ul className="space-y-3">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                >
                  <span className={`mt-1.5 size-1.5 rounded-full flex-shrink-0 ${style.bulletBg}`} />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Separator between AI Readiness and Stage */}
          <hr className="border-border" />

          {/* Stage */}
          <div className="space-y-6">
            <div className="space-y-2 text-left">
              <h3 className="from-foreground to-foreground dark:to-muted-foreground inline-block bg-linear-to-r bg-clip-text text-3xl sm:text-4xl leading-tight font-semibold text-transparent drop-shadow-md">
                {tierLabel} Stage
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {TIER_DESCRIPTIONS[tierLabel]}
              </p>
            </div>

            {/* Strategic Goal */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2">
                <Target className={`size-4 ${style.text}`} />
                <span className={`text-xs font-bold uppercase tracking-widest ${style.text}`}>Strategic Goal</span>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
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
