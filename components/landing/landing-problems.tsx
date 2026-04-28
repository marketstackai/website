import { Section } from "@/components/ui/section";
import type { LandingPageCopy } from "@/lib/landing/types";

interface LandingProblemsProps {
  copy: LandingPageCopy["problems"];
}

export function LandingProblems({ copy }: LandingProblemsProps) {
  return (
    <Section className="pt-10 pb-16 sm:pt-12 sm:pb-20">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-balance mx-auto">
            {copy.sectionHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[880px] mx-auto">
          {copy.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-2"
            >
              <p className="font-semibold text-foreground">{item.heading}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
