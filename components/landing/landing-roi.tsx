import { Section } from "@/components/ui/section";
import type { LandingPageCopy } from "@/lib/landing/types";

interface LandingROIProps {
  copy: LandingPageCopy["roi"];
}

export function LandingROI({ copy }: LandingROIProps) {
  return (
    <Section className="py-16 sm:py-20">
      <div className="max-w-container mx-auto px-6">
        <div className="max-w-[880px] mx-auto rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-8 py-10 sm:px-12 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              The Math
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-balance">
              {copy.sectionHeading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed text-balance">
              {copy.scenario}
            </p>
          </div>

          <div className="border-t border-border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {copy.metrics.map((metric, i) => (
              <div key={i} className="px-8 py-8 sm:px-10 flex flex-col gap-1">
                <p className="text-3xl sm:text-4xl font-bold text-brand">
                  {metric.value}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {metric.label}
                </p>
                {metric.sub && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {metric.sub}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
