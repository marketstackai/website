import { Section } from "../../ui/section";
import { Button } from "../../ui/button";
import Glow from "../../ui/glow";
import { ArrowUpRight } from "lucide-react";
import { AuditLink } from "../../ui/audit-link";

interface CTAProps {
  title?: string;
  industry?: string;
  interest?: string;
  subtext?: string | false;
}

export default function CTA({
  title = "Ready to eliminate your bottlenecks?",
  industry,
  interest,
  subtext = "AI Readiness Report",
}: CTAProps) {
  return (
    <Section className="group relative overflow-hidden">
      <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        <div className="flex flex-col items-center gap-4">
          <Button size="lg" asChild className="group">
            <AuditLink industry={industry} interest={interest} className="flex items-center gap-1">
              Start Your AI Audit
              <ArrowUpRight className="ml-2 size-4" />
            </AuditLink>
          </Button>
          {subtext && (
            <p className="text-muted-foreground animate-appear text-sm delay-300">
              {subtext}
            </p>
          )}
        </div>
      </div>
      <div className="absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" />
      </div>
    </Section>
  );
}
