import React from "../../logos/react";
import Claude from "../../logos/claude";
import Gemini from "../../logos/gemini";
import Logo from "../../ui/logo";
import { Section } from "../../ui/section";
import { ReactNode } from "react";

interface LogosProps {
  title?: string;
  badge?: ReactNode | false;
  logos?: ReactNode[] | false;
}

export default function Logos({
  title = "Built on the tools that power modern automation",
  badge = false,
  logos = [
    <Logo key="react" image={React} name="React" />,
    <Logo key="claude" image={Claude} name="Claude" />,
    <Logo key="gemini" image={Gemini} name="Gemini" />,
  ],
}: LogosProps) {
  return (
    <Section className="py-4 sm:py-6">
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          {badge !== false && badge}
          <h2 className="text-md font-semibold sm:text-2xl">{title}</h2>
        </div>
        {logos !== false && logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {logos}
          </div>
        )}
      </div>
    </Section>
  );
}
