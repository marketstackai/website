import type { TierLabel } from "@/lib/audit/types";

export type RecommendedStackLabel = "Foundation Kit" | "Operating System" | "Studio";

export interface RecommendedStackDisplay {
  id: "foundation_kit_primary" | "os_primary" | "studio_primary";
  title: RecommendedStackLabel;
  description: string;
  emailDescription: string;
  service: string;
  priceRange: string;
  timeline: string;
  roiProjection: string;
  ctaLabel: string;
  ctaHref: string;
  interest: string;
  recoveryRate: number;
}

export const TIER_DESCRIPTIONS: Record<TierLabel, string> = {
  Foundation: "Small, strategic changes to capture leads will have massive impact. You're leaving the most money on the table from basic response gaps.",
  Growth: "Your volume is outstripping your infrastructure. Automation isn't optional anymore — it's the difference between scaling and stalling.",
  Optimization: "You have the volume and the systems. Bespoke AI workflows will turn your stack into a compounding revenue engine.",
};

export const RECOMMENDED_STACKS: Record<RecommendedStackLabel, RecommendedStackDisplay> = {
  "Foundation Kit": {
    id: "foundation_kit_primary",
    title: "Foundation Kit",
    description: "Everything you need to capture missed leads and build a professional brand foundation. Website template, response blueprints, and review playbooks.",
    emailDescription: "Core AI systems to capture leads, automate follow-up, and stop revenue from slipping through the cracks.",
    service: "Foundation Product",
    priceRange: "$997",
    timeline: "Instant Access",
    roiProjection: "The foundational infrastructure required to stop the bleeding and start scaling.",
    ctaLabel: "Get the Kit",
    ctaHref: "/book",
    interest: "kit",
    recoveryRate: 0.20,
  },
  "Operating System": {
    id: "os_primary",
    title: "Operating System",
    description: "Our core revenue infrastructure. Fully automated lead response, custom CRM workflows, and professional website deployment.",
    emailDescription: "A complete AI-powered business operating system — from lead intake to pipeline management.",
    service: "Core Operating System",
    priceRange: "$4,500",
    timeline: "2 Weeks",
    roiProjection: "Professional scale. Every lead is captured, nurtured, and tracked automatically.",
    ctaLabel: "Book Your OS Setup",
    ctaHref: "/book",
    interest: "os",
    recoveryRate: 0.50,
  },
  Studio: {
    id: "studio_primary",
    title: "Studio",
    description: "Bespoke automation and AI ops. We build custom agents and workflows that turn your business into a high-leverage revenue machine.",
    emailDescription: "Custom AI agents, advanced automations, and bespoke workflows built around your business.",
    service: "Custom AI & Ops",
    priceRange: "Custom",
    timeline: "4–8 Weeks",
    roiProjection: "Maximum leverage. Custom-tailored systems designed for your specific business bottlenecks.",
    ctaLabel: "Book Studio Strategy Call",
    ctaHref: "/book",
    interest: "studio",
    recoveryRate: 0.70,
  },
};

export function getRecommendedStack(label: string): RecommendedStackDisplay | null {
  return label in RECOMMENDED_STACKS
    ? RECOMMENDED_STACKS[label as RecommendedStackLabel]
    : null;
}
