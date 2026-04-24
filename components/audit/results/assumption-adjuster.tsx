"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { MetricsGrid } from "./metrics-grid";
import type { AdjustableParams } from "@/lib/audit/types";

interface AssumptionAdjusterProps {
  params: AdjustableParams;
  onChange: (params: AdjustableParams) => void;
  onReset: () => void;
  onUpdateParam: (key: keyof AdjustableParams, value: number) => void;
  isAdjusted: boolean;
}

const LEAK_RATE_LABELS = [
  { value: 0.10, label: "AI System" },
  { value: 0.25, label: "Auto Text-Back" },
  { value: 0.40, label: "Answering Service" },
  { value: 0.60, label: "Voicemail" },
];

export function AssumptionAdjuster({
  params,
  onChange,
  onReset,
  onUpdateParam,
  isAdjusted,
}: AssumptionAdjusterProps) {
  const updateField = <K extends keyof AdjustableParams>(
    key: K,
    value: AdjustableParams[K],
  ) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
      <AccordionItem value="assumptions" className="border-brand/10">
        <AccordionTrigger className="justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:no-underline px-1 cursor-pointer">
          <span className="flex items-center gap-2">
            Adjust Results
            {isAdjusted && (
              <Badge variant="outline" className="text-[10px] py-0 font-medium">Modified</Badge>
            )}
            {isAdjusted && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Reset to calculated defaults"
                onClick={(e) => { e.stopPropagation(); onReset(); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onReset(); } }}
                className="inline-flex items-center justify-center size-5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3" />
              </span>
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-4 space-y-8 px-1">

          {/* Metric Cards */}
          <MetricsGrid params={params} onUpdateParam={onUpdateParam} />

          {/* Leak Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">Leak Rate</span>
                <InfoTooltip
                  content="The percentage of inbound leads that go unresponded. Varies by how you handle missed calls."
                />
              </div>
              <span className="text-sm font-bold tabular-nums">{Math.round(params.leakRate * 100)}%</span>
            </div>
            <Slider
              value={[params.leakRate * 100]}
              onValueChange={([v]) => updateField("leakRate", v / 100)}
              min={5}
              max={80}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
              {LEAK_RATE_LABELS.map((l) => (
                <span key={l.value}>{l.label} ({Math.round(l.value * 100)}%)</span>
              ))}
            </div>
          </div>

          {/* Close Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">Close Rate</span>
                <InfoTooltip
                  content="The percentage of properly responded-to leads that convert to paying jobs. Higher for businesses with mature sales processes."
                />
              </div>
              <span className="text-sm font-bold tabular-nums">{Math.round(params.closeRate * 100)}%</span>
            </div>
            <Slider
              value={[params.closeRate * 100]}
              onValueChange={([v]) => updateField("closeRate", v / 100)}
              min={5}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
              <span>5%</span>
              <span>15%</span>
              <span>25%</span>
              <span>35%</span>
              <span>50%</span>
            </div>
          </div>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
