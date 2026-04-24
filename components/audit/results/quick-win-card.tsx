"use client";

import React from "react";
import { ArrowUpRight, Clock, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingLink } from "@/components/ui/booking-link";
import type { QuickWin } from "@/lib/audit/types";

function CardContent({ win }: { win: QuickWin }) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {win.isPrimary && (
            <Badge variant="brand" className="mb-2 text-[10px] font-bold tracking-widest uppercase px-3 py-1">
              <Sparkles className="size-3 mr-1" />
              Recommended Stack
            </Badge>
          )}
          <h3 className="text-lg font-bold">
            {win.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{win.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <DollarSign className="size-4 text-brand" />
          <span className="font-medium">{win.priceRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-brand" />
          <span className="font-medium">{win.timeline}</span>
        </div>
      </div>

      <Button
        variant={win.isPrimary ? "glow" : "outline"}
        asChild
        className="group/btn w-full sm:w-auto"
      >
        <BookingLink interest={win.interest ?? ""} source="audit" className="flex items-center gap-1.5">
          Get Started
          <ArrowUpRight className="size-3.5 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
        </BookingLink>
      </Button>
    </>
  );
}

export function QuickWinCard({ win }: { win: QuickWin }) {
  if (win.isPrimary) {
    return (
      <div className="relative rounded-2xl p-8 shadow-xl overflow-hidden glass-3 from-card/100 to-card/100 dark:glass-4 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-brand-foreground/70 after:blur-[72px] group space-y-4">
        <hr className="via-brand absolute top-0 left-[10%] h-[1px] w-[80%] border-0 bg-linear-to-r from-transparent to-transparent" />
        <CardContent win={win} />
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm group overflow-hidden">
      <div className="p-6 space-y-4">
        <CardContent win={win} />
      </div>
    </div>
  );
}
