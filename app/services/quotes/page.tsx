import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Quote Follow-Up Automation",
  description:
    "Stop losing open quotes to silence. Automated follow-up sequences keep your estimates in front of prospects until they book or say no — without manual chasing.",
  keywords: [
    "quote follow-up automation",
    "estimate follow-up",
    "automated proposal follow-up",
    "sales follow-up system",
    "close more quotes",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Quote Follow-Up",
    headline: "You Sent the Quote. Now Close It.",
    subhead:
      "Most businesses send an estimate and wait. An automated follow-up sequence keeps your proposal in front of the prospect until they make a decision — turning open quotes into closed jobs without chasing.",
    ctaType: "audit",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Call",
    secondaryCtaHref: "/book",
    secondaryCtaInterest: "quotefollowup",
  },
  problems: {
    sectionHeading: "The quote you sent is probably forgotten by now.",
    items: [
      {
        heading: "Sending one quote and waiting",
        body: "Most service businesses send an estimate and follow up once, maybe twice. Then they assume the prospect moved on — but often the prospect was just busy, distracted, or comparing options.",
      },
      {
        heading: "No system for aging quotes",
        body: "That stack of open estimates from 2, 4, and 8 weeks ago represents real revenue. But without a system, it's invisible.",
      },
      {
        heading: "Winning business by responding fastest",
        body: "Studies consistently show that 60% of buyers choose whoever follows up first and most persistently. Silence reads as indifference.",
      },
      {
        heading: "Manual follow-up doesn't scale",
        body: "When you're running a growing operation, personally tracking and chasing 30+ open quotes isn't sustainable — so it doesn't get done.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A follow-up machine that works every open estimate.",
    items: [
      {
        heading: "Multi-step follow-up sequences",
        body: "Every quote automatically triggers a sequence: a follow-up SMS the next day, an email with a value reminder at day 3, a check-in call prompt at day 7.",
      },
      {
        heading: "Objection handling built in",
        body: "Common objections — pricing concerns, timing questions, comparison shopping — are addressed proactively in the sequence without requiring your involvement.",
      },
      {
        heading: "Auto-close and archive",
        body: "When a prospect books, the sequence stops. When they decline, they get archived appropriately. Nothing stays open and untracked.",
      },
      {
        heading: "Reactivation for aged quotes",
        body: "Quotes older than 30, 60, or 90 days get a fresh outreach campaign when circumstances may have changed in your favor.",
      },
    ],
  },
  roi: {
    sectionHeading: "How much revenue is sitting in open estimates?",
    scenario:
      "A contractor sending 35 quotes per month with a 30% close rate closes 10–11 jobs. Adding a structured 5-step follow-up sequence that lifts close rate to 40% produces 14 closed jobs instead — 3 additional jobs per month at $3,500 average value is $10,500 in monthly revenue added with zero new leads.",
    metrics: [
      { label: "Of buyers choose whoever follows up first", value: "60%", sub: "consistently" },
      { label: "Avg close rate lift with systematic follow-up", value: "+10pts", sub: "from 30% → 40%" },
      { label: "Added revenue (35 quotes, $3.5K avg)", value: "$10.5K/mo", sub: "3 more closes/month" },
    ],
  },
  crossLinks: [
    { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Work older dormant contacts" },
    { label: "Booking Recovery", href: "/services/booking-recovery", description: "Prevent no-shows once booked" },
    { label: "Home Services", href: "/home-services", description: "Full sales systems for trades" },
  ],
};

export default function QuoteFollowUpPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to close more of what you're quoting?" />;
}
