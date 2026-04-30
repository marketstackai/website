"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MetricsGrid } from "./metrics-grid";
import type { AdjustableParams } from "@/lib/audit/types";

interface AssumptionAdjusterProps {
  params: AdjustableParams;
  onReset: () => void;
  onUpdateParam: (key: keyof AdjustableParams, value: number) => void;
  isAdjusted: boolean;
}


export function AssumptionAdjuster({
  params,
  onReset,
  onUpdateParam,
  isAdjusted,
}: AssumptionAdjusterProps) {

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



        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
