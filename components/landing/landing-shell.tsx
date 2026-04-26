import Navbar from "@/components/sections/navbar/default";
import Footer from "@/components/sections/footer/default";
import CTA from "@/components/sections/cta/default";
import { LandingHero } from "./landing-hero";
import { LandingProblems } from "./landing-problems";
import { LandingOutcomes } from "./landing-outcomes";
import { LandingROI } from "./landing-roi";
import { LandingCrossLinks } from "./landing-cross-links";
import type { LandingPageCopy } from "@/lib/landing/types";

interface LandingShellProps {
  copy: LandingPageCopy;
  ctaTitle?: string;
}

export function LandingShell({ copy, ctaTitle }: LandingShellProps) {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Navbar />
      <LandingHero copy={copy.hero} />
      <LandingProblems copy={copy.problems} />
      <LandingOutcomes copy={copy.outcomes} />
      <LandingROI copy={copy.roi} />
      {copy.crossLinks && copy.crossLinks.length > 0 && (
        <LandingCrossLinks links={copy.crossLinks} />
      )}
      <CTA title={ctaTitle} />
      <Footer />
    </main>
  );
}
