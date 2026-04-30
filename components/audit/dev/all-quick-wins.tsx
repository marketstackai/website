"use client";

import React from "react";
import { Check, Clock, Tag, X } from "lucide-react";
import type { DebugQuickWin } from "@/lib/audit/recommendations";

interface AllQuickWinsProps {
  wins: DebugQuickWin[];
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
      active ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500/60"
    }`}>
      {active ? <Check className="size-2.5" /> : <X className="size-2.5" />}
      {label}
    </span>
  );
}

export function AllQuickWins({ wins }: AllQuickWinsProps) {
  return (
    <div className="border-l-4 border-amber-500/50 bg-amber-500/5 rounded-r-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500">All Quick Wins ({wins.length})</h3>
        <span className="text-xs text-muted-foreground">
          {wins.filter(w => w.inTopThree).length} in final output
        </span>
      </div>

      <div className="space-y-3">
        {wins.map(win => (
          <div
            key={win.id}
            className={`rounded-xl border p-4 space-y-2 transition-colors ${
              win.inTopThree
                ? "border-brand/30 bg-brand/5"
                : win.triggerMet
                  ? "border-border bg-card/30"
                  : "border-border/50 bg-muted/10 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm">{win.title}</span>
                  {win.isPrimary && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{win.id}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <StatusBadge active={win.triggerMet} label="Trigger" />
                <StatusBadge active={win.meetsRoiThreshold} label="ROI" />
                <StatusBadge active={win.inTopThree} label="Shown" />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground/70 font-mono">{win.triggerDescription}</p>

            {win.triggerMet && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Tag className="size-3 text-brand" />
                  {win.priceRange}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-brand" />
                  {win.timeline}
                </span>
                <span className="tabular-nums">
                  {win.recoveredLeads} leads &rarr; ${Math.round(win.recoveredMonthly).toLocaleString()}/mo
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
