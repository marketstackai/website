import { Section } from "../../ui/section";
import { Button, type ButtonProps } from "../../ui/button";
import { siteConfig } from "@/config/site";
import Glow from "../../ui/glow";
import { ArrowRightIcon, ArrowUpRight } from "lucide-react";
import { ReactNode } from "react";

interface CTAButtonProps {
  href: string;
  text: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface CTAProps {
  title?: string;
  buttons?: CTAButtonProps[] | false;
  subtext?: string | false;
}

export default function CTA({
  title = "Ready to eliminate your bottlenecks?",
  buttons = [
    {
      href: `${siteConfig.auditUrl}`,
      text: "Start Your AI Audit",
      variant: "default" as const,
      iconRight: <ArrowUpRight className="ml-2 size-4" />,
    },
  ],
  subtext = "AI Readiness Report",
}: CTAProps) {
  return (
    <Section className="group relative overflow-hidden">
      <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        {buttons !== false && buttons.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || "default"}
                  size="lg"
                  asChild
                  className="group"
                >
                  <a href={button.href} className="flex items-center gap-1">
                    {button.icon}
                    {button.text}
                    {button.iconRight}
                  </a>
                </Button>
              ))}
            </div>
            {subtext && (
              <p className="text-sm text-muted-foreground animate-appear delay-300">
                {subtext}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" />
      </div>
    </Section>
  );
}
