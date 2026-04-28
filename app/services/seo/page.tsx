import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Local SEO",
  description:
    "Dominate local search. We optimize your Google Business Profile, citations, and on-page SEO so your business shows up when nearby customers are looking.",
  keywords: [
    "local SEO",
    "Google Business Profile optimization",
    "local search optimization",
    "local SEO for small business",
    "rank higher on Google Maps",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Local SEO",
    headline: "Show Up When Your Best Customers Are Searching.",
    subhead:
      "85% of local service buyers start their search online. If your business isn't showing up in the top results for your area, those jobs are going to whoever is — we fix that.",
    ctaType: "audit",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Call",
    secondaryCtaHref: "/book",
    interest: "seo",
  },
  problems: {
    sectionHeading: "You're invisible in the searches that matter most.",
    items: [
      {
        heading: "Your Google Business Profile is incomplete or stale",
        body: "Missing categories, outdated hours, no recent posts, zero photos — Google treats these as signals of an inactive business and ranks you lower.",
      },
      {
        heading: "Your citation data is inconsistent",
        body: "If your name, address, or phone number differs across directories, Google loses confidence in your business information and suppresses your ranking.",
      },
      {
        heading: "Competitors with more reviews outrank you",
        body: "Review volume, recency, and response rate are direct local ranking factors. A competitor with 150 recent reviews will rank above you even if your service is better.",
      },
      {
        heading: "You're not showing up in the 3-pack",
        body: "The Google 3-pack captures 70%+ of clicks on local search results. If you're not in it, you're effectively invisible to most prospects.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A local search presence that generates calls on autopilot.",
    items: [
      {
        heading: "Fully optimized Google Business Profile",
        body: "Categories, services, photos, posts, Q&A, and attributes — all optimized for maximum visibility in your service area.",
      },
      {
        heading: "Citation cleanup and consistency",
        body: "We audit and correct your business information across the directories Google uses to validate your location and relevance.",
      },
      {
        heading: "Review strategy integration",
        body: "Local SEO and review generation work together — more reviews mean better ranking, and better ranking means more opportunities to get reviews.",
      },
      {
        heading: "Ongoing signal building",
        body: "Fresh posts, updated content, and response patterns maintained on a schedule that keeps your profile active and trusted by the algorithm.",
      },
    ],
  },
  roi: {
    sectionHeading: "The difference between showing up and being found.",
    scenario:
      "A home services business ranking 8th in local search for its primary keyword gets roughly 3% of clicks on that result page. The same business ranking in the top 3 gets 30–60% of clicks. For a market generating 400 searches per month, moving from position 8 to position 2 is the difference between 12 clicks and 120+ — same service area, same business, same advertising budget.",
    metrics: [
      { label: "Of local buyers start on Google", value: "85%", sub: "before calling" },
      { label: "Click share for top 3 Google Map results", value: "70%+", sub: "vs. 3% below position 4" },
      { label: "More calls for businesses with optimized profiles", value: "7×", sub: "vs. unoptimized" },
    ],
  },
  crossLinks: [
    { label: "Review Automation", href: "/services/reviews", description: "Reviews power your local ranking" },
    { label: "GEO", href: "/services/geo", description: "Optimize for AI-powered search too" },
    { label: "Home Services", href: "/home-services", description: "Full growth systems for trades" },
  ],
};

export default function LocalSEOPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to rank where your customers are searching?" />;
}
