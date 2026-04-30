import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import type { LandingPageCopy } from "@/lib/landing/types";

interface LandingOutcomesProps {
  copy: LandingPageCopy["outcomes"];
}

export function LandingOutcomes({ copy }: LandingOutcomesProps) {
  return (
    <Section className="py-16 sm:py-20">
      <div className="max-w-container mx-auto px-0 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-balance max-w-[600px] mx-auto mb-4">
            What You Get
          </h2>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {copy.sectionHeading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[880px] mx-auto">
          {copy.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl border bg-background p-6 flex flex-col gap-2",
                "border-border",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 size-5 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
                  <div className="size-2 rounded-full bg-brand" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-foreground">{item.heading}</p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
