"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface AIReadinessCardProps {
  score: "Low" | "Moderate" | "High";
  description: string;
}

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
    "Your infrastructure supports AI-assisted follow-up and intake workflows.",
    "Start with conversational AI for intake — highest leverage, lowest risk.",
    "Avoid over-engineering; targeted automation will outperform broad AI rollouts.",
  ],
  High: [
    "You're primed for bespoke AI agents that operate with minimal supervision.",
    "Custom workflows and AI-assisted decision-making are within reach now.",
    "Focus on compounding: AI that improves as it learns from your pipeline data.",
  ],
};

const STEPS = ["Low", "Moderate", "High"] as const;
const STEP_INDEX: Record<string, number> = { Low: 0, Moderate: 1, High: 2 };

export function AIReadinessCard({ score, description }: AIReadinessCardProps) {
  const style = SCORE_STYLE[score];
  const bullets = BULLETS[score];
  const activeIndex = STEP_INDEX[score] ?? 0;

  return (
    <div className="animate-appear delay-300 w-full mb-12">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10 space-y-7">

          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              AI Readiness
            </span>
            <Badge
              variant="outline"
              className={`text-xs font-bold px-3 py-1 ${style.badgeClass}`}
            >
              {score}
            </Badge>
          </div>

          {/* 3-step gauge */}
          <div className="flex items-start gap-0 pt-1">
            {STEPS.map((step, i) => {
              const isActive = i <= activeIndex;
              const isLineActive = i < activeIndex;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
                    <div
                      className={`size-3 rounded-full transition-colors ${
                        isActive
                          ? `${style.nodeBg}`
                          : "bg-muted-foreground/20"
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

          {/* Description */}
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* What this means bullets */}
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
      </div>
    </div>
  );
}
