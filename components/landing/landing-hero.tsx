import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import Glow from "@/components/ui/glow";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BookingLink } from "@/components/ui/booking-link";
import type { LandingPageCopy } from "@/lib/landing/types";

interface LandingHeroProps {
  copy: LandingPageCopy["hero"];
}

export function LandingHero({ copy }: LandingHeroProps) {
  const {
    eyebrow,
    headline,
    subhead,
    ctaType,
    industry,
    interest,
    primaryCtaLabel,
    secondaryCtaLabel,
    secondaryCtaHref,
    secondaryCtaInterest,
  } = copy;

  const auditHref = industry
    ? `/audit/start?industry=${industry}`
    : "/audit/start";

  const primaryLabel =
    primaryCtaLabel ?? (ctaType === "demo" ? "Book a Demo" : "Start Your AI Audit");

  return (
    <Section className="fade-bottom overflow-hidden pb-12 sm:pb-16 pt-52 sm:pt-64">
      <div className="max-w-container mx-auto flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col items-center gap-5 text-center sm:gap-8">
          {eyebrow && (
            <Badge variant="outline" className="animate-appear border-brand/50 text-foreground px-4 py-1.5 text-sm">
              {eyebrow}
            </Badge>
          )}

          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight">
            {headline}
          </h1>

          <div className="animate-appear relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 opacity-0 delay-100">
            {ctaType === "demo" && interest ? (
              <Button size="lg" asChild>
                <BookingLink interest={interest} className="flex items-center gap-1">
                  {primaryLabel}
                  <ArrowUpRight className="ml-1 size-4" />
                </BookingLink>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href={auditHref} className="flex items-center gap-1">
                  {primaryLabel}
                  <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>
            )}

            {secondaryCtaLabel && (
              ctaType === "demo" ? (
                <Button variant="outline" size="lg" asChild>
                  <Link href={secondaryCtaHref ?? auditHref}>
                    {secondaryCtaLabel}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="lg" asChild>
                  {secondaryCtaInterest ? (
                    <BookingLink interest={secondaryCtaInterest}>
                      {secondaryCtaLabel}
                    </BookingLink>
                  ) : (
                    <Link href={secondaryCtaHref ?? "/book"}>
                      {secondaryCtaLabel}
                    </Link>
                  )}
                </Button>
              )
            )}
          </div>
        </div>

        <div className="opacity-40">
          <Glow variant="top" className="animate-appear-zoom opacity-0 delay-700" />
        </div>
      </div>
    </Section>
  );
}
