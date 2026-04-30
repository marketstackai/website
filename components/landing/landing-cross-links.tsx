import { Section } from "@/components/ui/section";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CrossLink } from "@/lib/landing/types";

interface LandingCrossLinksProps {
  links: CrossLink[];
  heading?: string;
}

export function LandingCrossLinks({
  links,
  heading = "Also relevant",
}: LandingCrossLinksProps) {
  return (
    <Section className="py-12 sm:py-16">
      <div className="max-w-container mx-auto px-0 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 text-center">
          {heading}
        </p>
        <div className="flex flex-wrap justify-center gap-3 max-w-[640px] mx-auto">
          {links.slice(0, 3).map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="group flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-base font-medium text-muted-foreground hover:border-brand/40 hover:text-foreground transition-colors"
            >
              {link.label}
              <ArrowUpRight className="size-3 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
