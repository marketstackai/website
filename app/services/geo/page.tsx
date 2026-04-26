import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Generative Engine Optimization (GEO)",
  description:
    "When someone asks an AI assistant for a recommendation in your industry, is your business mentioned? GEO ensures your business shows up in AI-driven search — the fastest-growing discovery channel.",
  keywords: [
    "generative engine optimization",
    "GEO",
    "AI search optimization",
    "ChatGPT SEO",
    "optimize for AI search",
    "be found in AI recommendations",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Generative Engine Optimization",
    headline: "When AI Recommends Businesses, Will Yours Be One of Them?",
    subhead:
      "Search is changing. When a prospect asks an AI assistant which contractor, lender, or firm to use in their area, those recommendations come from structured data, authority signals, and content that most businesses haven't built yet. GEO positions you for that channel before your competitors notice it exists.",
    ctaType: "audit",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Call",
    secondaryCtaHref: "/book",
    secondaryCtaInterest: "geo",
  },
  problems: {
    sectionHeading: "AI search doesn't work like Google. Most businesses aren't ready.",
    items: [
      {
        heading: "You're invisible to AI recommendation engines",
        body: "AI assistants pull from structured content, authoritative sources, and entities with clear digital footprints. If your business doesn't have that, you don't get cited — even if you rank on Google.",
      },
      {
        heading: "Standard SEO doesn't transfer 1:1",
        body: "Ranking for a keyword and being recommended by an AI require different signals. Schema markup, citation consistency, authoritative mentions, and structured answers matter more than keyword density.",
      },
      {
        heading: "Early movers will be hard to displace",
        body: "AI recommendation systems build trust in sources over time. The businesses that establish authority now will be harder to displace as these channels mature.",
      },
      {
        heading: "You don't know what queries are citing competitors",
        body: "Without monitoring what AI systems say about your category, you can't know whether you're being mentioned, mis-described, or ignored entirely.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "Built for the way search is actually being used today.",
    items: [
      {
        heading: "Structured data and entity optimization",
        body: "Schema markup, knowledge panel signals, and entity associations that tell AI systems exactly who you are, what you do, and where you operate.",
      },
      {
        heading: "Content structured for AI citation",
        body: "FAQ content, service descriptions, and location pages written in the format that AI systems pull from when constructing recommendations and answers.",
      },
      {
        heading: "Citation and authority building",
        body: "Mentions in authoritative directories, publications, and industry sources that AI systems use to validate business legitimacy and relevance.",
      },
      {
        heading: "Ongoing monitoring and adjustment",
        body: "Regular testing of how AI assistants respond to queries in your category, with adjustments to improve representation over time.",
      },
    ],
  },
  roi: {
    sectionHeading: "A new channel with low competition and compounding returns.",
    scenario:
      "AI-assisted search is growing 65% year over year. A local professional service firm that establishes strong GEO signals now enters a channel with low competitive density — most competitors haven't invested at all. Early-mover positioning in a channel that's becoming a primary discovery source for high-intent buyers is a compounding asset, not a one-time tactic.",
    metrics: [
      { label: "AI search growth YoY", value: "65%+", sub: "and accelerating" },
      { label: "Businesses with active GEO strategy", value: "< 5%", sub: "low competition window" },
      { label: "Compounding value of early positioning", value: "Long-term", sub: "authority compounds" },
    ],
  },
  crossLinks: [
    { label: "Local SEO", href: "/services/seo", description: "Optimize for traditional local search too" },
    { label: "Website Builds", href: "/services/websites", description: "Structured content starts with the right site" },
    { label: "Tech GTM", href: "/tech-gtm", description: "GEO for B2B SaaS discovery" },
  ],
};

export default function GEOPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to show up in AI-powered search?" />;
}
