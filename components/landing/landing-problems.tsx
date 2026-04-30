import { Section } from "@/components/ui/section";
import type { LandingPageCopy } from "@/lib/landing/types";

interface LandingProblemsProps {
  copy: LandingPageCopy["problems"];
}

export function LandingProblems({ copy }: LandingProblemsProps) {
  return (
    <Section className="pt-10 pb-16 sm:pt-12 sm:pb-20">
      <div className="max-w-container mx-auto px-0 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-balance mx-auto mb-4">
            The Problem
          </h2>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {copy.sectionHeading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[840px] mx-auto">
          {copy.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6 flex flex-col gap-2"
            >
              <p className="font-semibold text-foreground">{item.heading}</p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
