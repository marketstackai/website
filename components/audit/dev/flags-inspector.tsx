"use client";

import React from "react";
import type { AuditResults, QuizData } from "@/lib/audit/types";

interface FlagsInspectorProps {
  results: AuditResults;
  data: QuizData;
}

interface FlagDef {
  key: string;
  label: string;
  value: boolean;
  trigger: string;
}

export function FlagsInspector({ results, data }: FlagsInspectorProps) {
  const flags: FlagDef[] = [
    { key: "hotLead", label: "Hot Lead", value: results.hotLead, trigger: `urgency="${data.urgency}" === "urgent" AND score ${results.totalScore} >= 65` },
    { key: "highTicket", label: "High Ticket", value: results.highTicket, trigger: `revenue $${(parseFloat(data.monthly_revenue) || 0).toLocaleString()} >= $100k/mo` },
    { key: "quickWinOpp", label: "Quick Win Opp", value: results.quickWinOpp, trigger: `"missed_leads" in challenges AND response in {voicemail, office_pickup, auto_response}` },
    { key: "enterpriseSignal", label: "Enterprise", value: results.enterpriseSignal, trigger: `team=${data.team_size} >= 50 OR (team >= 21 AND revenue >= $250k/mo)` },
    { key: "nurtureTrack", label: "Nurture", value: results.nurtureTrack, trigger: `urgency="${data.urgency}" === "exploring"` },
    { key: "needsReview", label: "Needs Review", value: results.needsReview, trigger: `industry="other" AND no custom text` },
    { key: "isRevenueUndisclosed", label: "Rev Undisclosed", value: results.isRevenueUndisclosed, trigger: `monthly_revenue="${data.monthly_revenue}"` },
    { key: "isJobValueUndisclosed", label: "Job Val Undisclosed", value: results.isJobValueUndisclosed, trigger: `avg_job_value="${data.avg_job_value}"` },
    { key: "isLeadsUserProvided", label: "Leads Provided", value: results.isLeadsUserProvided, trigger: `monthly_leads="${data.monthly_leads}"` },
  ];

  return (
    <div className="border-l-4 border-amber-500/50 bg-amber-500/5 rounded-r-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">Flags</h3>
        <span className="text-xs text-muted-foreground">
          {flags.filter(f => f.value).length}/{flags.length} active
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {flags.map(f => (
          <div key={f.key} className="flex items-start gap-2.5 text-sm">
            <span className={`mt-0.5 size-2.5 rounded-full shrink-0 ${f.value ? "bg-green-500" : "bg-red-500/40"}`} />
            <div className="min-w-0">
              <span className={`font-medium ${f.value ? "text-foreground" : "text-muted-foreground"}`}>{f.label}</span>
              <p className="text-[11px] text-muted-foreground/70 truncate">{f.trigger}</p>
            </div>
          </div>
        ))}
      </div>

      {results.aiReadiness && (
        <div className="pt-3 border-t border-amber-500/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">AI Readiness</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              results.aiReadiness.score === "High" ? "bg-green-500/10 text-green-500" :
              results.aiReadiness.score === "Moderate" ? "bg-brand/10 text-brand" :
              "bg-orange-500/10 text-orange-500"
            }`}>
              {results.aiReadiness.score}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground/70 mt-1">{results.aiReadiness.description}</p>
        </div>
      )}
    </div>
  );
}
