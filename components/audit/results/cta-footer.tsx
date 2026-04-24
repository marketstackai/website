"use client";

import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingLink } from "@/components/ui/booking-link";
import type { TierLabel } from "@/lib/audit/types";

interface CTAFooterProps {
  recommendedPackage: string;
  tierLabel: TierLabel;
  email: string;
  onStartOver: () => void;
}

const TIER_INTEREST: Record<TierLabel, string> = {
  Foundation: "kit",
  Growth: "os",
  Optimization: "studio",
};

export function CTAFooter({
  recommendedPackage,
  tierLabel,
  email,
  onStartOver,
}: CTAFooterProps) {
  const primaryInterest = TIER_INTEREST[tierLabel];
  const primaryLabel =
    recommendedPackage === "Foundation Kit"
      ? "Get the Foundation Kit"
      : `Book Your ${recommendedPackage} Call`;

  return (
    <div className="pt-24 border-t text-center space-y-6 animate-appear delay-700">
      <Button asChild size="lg" className="w-full sm:w-auto px-12">
        <BookingLink interest={primaryInterest} source="audit" className="flex items-center gap-2">
          {primaryLabel}
          <ArrowRightIcon className="size-4 ml-1" />
        </BookingLink>
      </Button>

      <p className="text-xs text-muted-foreground/50">
        Your results are saved. We&apos;ll be in touch at {email}.
      </p>

      <Button
        variant="ghost"
        size="sm"
        onClick={onStartOver}
        className="text-muted-foreground hover:text-foreground"
      >
        Start Over
      </Button>
    </div>
  );
}
