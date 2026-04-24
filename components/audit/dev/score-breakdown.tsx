"use client";

import React from "react";
import type { QuizData, TierLabel } from "@/lib/audit/types";
import { SCORES, getRevenueScore, ITEM_WEIGHTS, TIER_THRESHOLDS } from "@/lib/audit/constants";
import { getTeamBucket } from "@/lib/audit/engine";

interface ScoreBreakdownProps {
  data: QuizData;
  totalScore: number;
  tierLabel: TierLabel;
}

export function ScoreBreakdown({ data, totalScore, tierLabel }: ScoreBreakdownProps) {
  const teamBucket = getTeamBucket(data.team_size);
  const challengeMax = data.biggest_challenges.reduce(
    (max, c) => Math.max(max, SCORES.biggest_challenge[c] ?? 0), 0
  );

  const rows = [
    { label: "Team Size", value: `${data.team_size} (${teamBucket})`, score: SCORES.team_size[teamBucket] ?? 0, weight: ITEM_WEIGHTS.team_size },
    { label: "Revenue", value: data.monthly_revenue === "undisclosed" ? "Undisclosed" : `$${Number(data.monthly_revenue).toLocaleString()}`, score: getRevenueScore(data.monthly_revenue), weight: ITEM_WEIGHTS.monthly_revenue },
    { label: "Lead Response", value: data.lead_response || "—", score: SCORES.lead_response[data.lead_response] ?? 0, weight: ITEM_WEIGHTS.lead_response },
    { label: "Challenge (max)", value: data.biggest_challenges.join(", ") || "—", score: challengeMax, weight: ITEM_WEIGHTS.biggest_challenge },
    { label: "AI Experience", value: data.ai_experience || "—", score: SCORES.ai_experience[data.ai_experience] ?? 0, weight: ITEM_WEIGHTS.ai_experience },
    { label: "Urgency", value: data.urgency || "—", score: SCORES.urgency[data.urgency] ?? 0, weight: ITEM_WEIGHTS.urgency },
  ];

  const isRevenueDisclosed = data.monthly_revenue && data.monthly_revenue !== "undisclosed";
  const earned = rows.reduce((sum, r) => sum + r.score, 0);
  const availableWeight = isRevenueDisclosed ? 100 : 100 - ITEM_WEIGHTS.monthly_revenue;

  const thresholds = {
    Foundation: `0–${TIER_THRESHOLDS.growth - 1}`,
    Growth: `${TIER_THRESHOLDS.growth}–${TIER_THRESHOLDS.optimization - 1}`,
    Optimization: `${TIER_THRESHOLDS.optimization}+`,
  };

  return (
    <div className="border-l-4 border-amber-500/50 bg-amber-500/5 rounded-r-xl p-5 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">Score Breakdown</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground uppercase tracking-wider">
            <th className="text-left pb-2 font-medium">Category</th>
            <th className="text-left pb-2 font-medium">Value</th>
            <th className="text-right pb-2 font-medium">Pts / Weight</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {rows.map(r => (
            <tr key={r.label}>
              <td className="py-1.5 font-medium">{r.label}</td>
              <td className="py-1.5 text-muted-foreground truncate max-w-[140px]">{r.value}</td>
              <td className="py-1.5 text-right font-bold tabular-nums">
                {r.score}
                <span className="text-muted-foreground font-normal"> / {r.weight}</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border">
            <td className="pt-2 font-bold">
              Total
              <span className="block text-[10px] text-muted-foreground font-normal">
                {earned} / {availableWeight} {!isRevenueDisclosed && "(rev undisclosed)"}
              </span>
            </td>
            <td className="pt-2">
              <span className="text-xs text-muted-foreground">
                {Object.entries(thresholds).map(([t, range]) => (
                  <span key={t} className={tierLabel === t ? "text-brand font-bold" : ""}>
                    {t}: {range}{t !== "Optimization" ? " · " : ""}
                  </span>
                ))}
              </span>
            </td>
            <td className="pt-2 text-right font-bold text-lg tabular-nums text-brand">{totalScore}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
