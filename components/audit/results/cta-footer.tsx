"use client";

import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { TierLabel } from "@/lib/audit/types";

interface CTAFooterProps {
  recommendedPackage: string;
  tierLabel: TierLabel;
  email: string;
  onStartOver: () => void;
}

const TIER_CTA_HREF: Record<TierLabel, string> = {
  Foundation: "/book?ref=foundation&source=audit",
  Growth: "/book?ref=os&source=audit",
  Optimization: "/book?ref=studio&source=audit",
};

export function CTAFooter({
  recommendedPackage,
  tierLabel,
  email,
  onStartOver,
}: CTAFooterProps) {
  const primaryHref = TIER_CTA_HREF[tierLabel];
  const primaryLabel =
    recommendedPackage === "Foundation Kit"
      ? "Get the Foundation Kit"
      : `Book Your ${recommendedPackage} Call`;

  return (
    <div className="pt-24 border-t text-center space-y-6 animate-appear delay-700">
      <Button asChild size="lg" className="w-full sm:w-auto px-12">
        <Link href={primaryHref} className="flex items-center gap-2">
          {primaryLabel}
          <ArrowRightIcon className="size-4 ml-1" />
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/services#stack">View Your Recommended Stack</Link>
        </Button>

        <Button variant="ghost" size="sm" asChild>
          <Link href="/book?ref=stack-audit&source=audit">
            Book a Paid Audit — $500 credit toward a project
          </Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground/50 pt-4">
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
