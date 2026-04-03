"use client";

import React from "react";
import { QuickWinCard } from "./quick-win-card";
import type { QuickWin } from "@/lib/audit/types";

interface QuickWinsSectionProps {
  quickWins: QuickWin[];
}

export function QuickWinsSection({ quickWins }: QuickWinsSectionProps) {
  if (quickWins.length === 0) return null;

  return (
    <div className="space-y-8 animate-appear delay-500">
      <h2 className="text-3xl font-semibold tracking-tight text-center">Your Top Quick Wins</h2>

      <p className="text-center text-muted-foreground text-sm max-w-xl mx-auto">
        Based on your answers, these are the highest-impact actions you can take right now — ranked by potential revenue recovered.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {quickWins.map((win) => (
          <QuickWinCard key={win.id} win={win} />
        ))}
      </div>
    </div>
  );
}
