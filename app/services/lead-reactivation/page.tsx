import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Lead Reactivation Campaigns",
  description:
    "Re-engage dormant leads and past customers with automated reactivation campaigns that turn cold contacts into booked jobs — without new ad spend.",
  keywords: [
    "lead reactivation",
    "dormant lead campaigns",
    "re-engage old leads",
    "automated follow-up",
    "win back past customers",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Lead Reactivation",
    headline: "Your Best Leads Are Already in Your System.",
    subhead:
      "Every business has a database of contacts who showed interest but never converted. A systematic reactivation campaign turns that dormant list into booked jobs — fast, without new ad spend.",
    ctaType: "audit",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Call",
    secondaryCtaHref: "/book",
    interest: "reactivation",
  },
  problems: {
    sectionHeading: "You're sitting on revenue and don't know it.",
    items: [
      {
        heading: "Leads go quiet and you assume they're dead",
        body: "Most businesses stop following up after two or three attempts. But many of those contacts weren't ready — they were just waiting for the right moment.",
      },
      {
        heading: "No system to re-engage at scale",
        body: "Manually reaching back out to hundreds of old contacts isn't realistic. So nothing happens, and that database ages out of value.",
      },
      {
        heading: "Seasonal opportunities get missed",
        body: "HVAC season, storm surges, year-end budget spend — the right outreach at the right time reactivates contacts you'd written off.",
      },
      {
        heading: "New leads cost more than old ones",
        body: "Acquiring a new lead costs 5–10× more than re-engaging someone who already knows your business. You're leaving your cheapest revenue on the table.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A campaign that works your existing database hard.",
    items: [
      {
        heading: "Automated multi-step outreach",
        body: "SMS, email, and voicemail sequences that reach dormant contacts at optimal intervals — without you managing a single step.",
      },
      {
        heading: "Personalized at scale",
        body: "Each message references what the contact previously inquired about, creating relevance that generic blasts can't match.",
      },
      {
        heading: "Immediate pipeline impact",
        body: "Reactivation campaigns typically generate booked calls within the first 48 hours of launch.",
      },
      {
        heading: "Ongoing nurture for unresponsive contacts",
        body: "Contacts that don't respond immediately stay in a long-term nurture sequence that keeps your business top of mind until they're ready.",
      },
    ],
  },
  roi: {
    sectionHeading: "The math on your dormant database.",
    scenario:
      "A business with 400 past leads that never converted — many of them simply not ready at the time — runs a structured reactivation campaign. At a 3% reactivation rate and $4,000 average job value, that's 12 new bookings and $48,000 in revenue from contacts you already paid to acquire.",
    metrics: [
      { label: "Typical reactivation rate", value: "2–5%", sub: "of dormant contacts" },
      { label: "Cost per reactivated lead vs. new", value: "10×", sub: "cheaper than new acquisition" },
      { label: "Revenue from 400-contact campaign", value: "$32K+", sub: "at 2% and $4K avg job" },
    ],
  },
  crossLinks: [
    { label: "Quote Follow-Up", href: "/services/quotes", description: "Recover open estimates before they go cold" },
    { label: "Review Automation", href: "/services/reviews", description: "Turn reactivated customers into reviews" },
    { label: "Home Services", href: "/home-services", description: "Full growth systems for trades" },
  ],
};

export default function LeadReactivationPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to work your dormant pipeline?" />;
}
