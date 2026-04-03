"use client";

import React from "react";
import { Target, TrendingDown, BarChart3, Zap } from "lucide-react";
import { MetricCard } from "./metric-card";
import type { AdjustableParams } from "@/lib/audit/types";

interface MetricsGridProps {
  params: AdjustableParams;
  onUpdateParam: (key: keyof AdjustableParams, value: number) => void;
}

export function MetricsGrid({
  params,
  onUpdateParam,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
      <MetricCard
        label="Leads/mo"
        value={`${params.leads}`}
        icon={Target}
        tooltip={<p>The estimated number of new potential customer inquiries received by your business every month.</p>}
        isEditable
        type="number"
        rawValue={params.leads}
        onValueChange={(val) => onUpdateParam("leads", Math.max(1, val))}
      />
      <MetricCard
        label="Leak Rate"
        value={`${Math.round(params.leakRate * 100)}%`}
        icon={TrendingDown}
        tooltip={<p>The percentage of inbound leads that are missed or lost due to slow or non-existent response times.</p>}
        isEditable
        type="percent"
        rawValue={params.leakRate}
        onValueChange={(val) => onUpdateParam("leakRate", Math.min(Math.max(val, 0.05), 0.85))}
      />
      <MetricCard
        label="Close Rate"
        value={`${Math.round(params.closeRate * 100)}%`}
        icon={BarChart3}
        tooltip={<p>The percentage of properly handled leads that successfully convert into paying customers.</p>}
        isEditable
        type="percent"
        rawValue={params.closeRate}
        onValueChange={(val) => onUpdateParam("closeRate", Math.min(Math.max(val, 0.05), 0.50))}
      />
      <MetricCard
        label="Avg Job Value"
        value={`$${params.jobValue.toLocaleString()}`}
        icon={Zap}
        tooltip={<p>The average gross revenue generated from a single successfully closed lead or completed project.</p>}
        isEditable
        type="currency"
        rawValue={params.jobValue}
        onValueChange={(val) => onUpdateParam("jobValue", Math.max(0, val))}
      />
    </div>
  );
}
