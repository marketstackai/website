import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Websites",
  description:
    "Your website should be generating leads, not just existing. We build fast, conversion-focused sites that rank, load instantly, and turn visitors into booked jobs.",
  keywords: [
    "website build for small business",
    "conversion focused website",
    "small business website design",
    "landing page build",
    "fast website for contractors",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Website Builds",
    headline: "A Website That Works as Hard as You Do.",
    subhead:
      "Most small business websites exist — they don't perform. We build fast, conversion-focused sites designed from the ground up to rank in local search and turn visitors into booked calls.",
    ctaType: "demo",
    interest: "website",
    primaryCtaLabel: "Book a Demo",
    secondaryCtaLabel: "Start Your AI Audit",
    secondaryCtaHref: "/audit/start",
  },
  problems: {
    sectionHeading: "Your current site is costing you leads you can't see.",
    items: [
      {
        heading: "Slow load times kill conversions",
        body: "Pages that take more than 3 seconds to load lose half their visitors before a single word is read. Google also penalizes slow sites in search ranking.",
      },
      {
        heading: "No clear path to contact",
        body: "If a visitor can't find your phone number, booking form, or service list within seconds, they leave. Most small business sites make people hunt.",
      },
      {
        heading: "Not optimized for local search",
        body: "A site without proper structure, schema markup, or local landing pages doesn't rank for the searches that drive your most valuable traffic.",
      },
      {
        heading: "DIY builds that look like DIY builds",
        body: "Template drag-and-drop sites work for getting something online. They don't build trust with a $4,000 job prospect who's sizing you up in 8 seconds.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "Built to rank, load fast, and convert.",
    items: [
      {
        heading: "Speed-first architecture",
        body: "Sub-2-second load times on mobile and desktop. Core Web Vitals optimized. Google rewards fast sites with higher rankings and more traffic.",
      },
      {
        heading: "Conversion-optimized layout",
        body: "Clear headline, trust signals above the fold, frictionless contact options, and service pages structured to answer the buyer's question and prompt action.",
      },
      {
        heading: "Local SEO foundation built in",
        body: "Proper schema markup, location landing pages, and on-page optimization so your site works with your Google Business Profile, not against it.",
      },
      {
        heading: "Deployed in 2 weeks",
        body: "No 3-month agency timelines. We move fast, build clean, and hand you a site that's live, optimized, and connected to your lead capture system.",
      },
    ],
  },
  roi: {
    sectionHeading: "Your website is a lead generation asset, not a brochure.",
    scenario:
      "A service business driving 400 monthly visitors to a poorly converting site at 1.5% contact rate generates 6 leads. Rebuilding for speed and conversion at 4% contact rate produces 16 leads from the same traffic — 10 additional inquiries per month, at $3,000 average value, without touching the ad budget.",
    metrics: [
      { label: "Better conversion on sub-2s sites", value: "3×", sub: "vs. over 4 seconds" },
      { label: "Additional leads/mo (400 visitors, 1.5→4%)", value: "+10", sub: "from the same traffic" },
      { label: "Deployment timeline", value: "2 wks", sub: "not 3 months" },
    ],
  },
  crossLinks: [
    { label: "Converational AI", href: "/services/ai-conversational", description: "Engage visitors the moment they land" },
    { label: "Local SEO", href: "/services/seo", description: "Rank for searches that drive your business" },
    { label: "Home Services", href: "/home-services", description: "Full systems for trades businesses" },
  ],
};

export default function WebsiteBuildsPage() {
  return <LandingShell copy={copy} ctaTitle="Ready for a site that actually generates leads?" />;
}
