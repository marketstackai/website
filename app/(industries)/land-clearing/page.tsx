import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Land Clearing & Grading Contractors",
  description:
    "Land clearing and grading contractors use Market Stack to automate lead response, bid follow-up, and project communication — keeping their pipeline full without adding office overhead.",
  keywords: [
    "AI for land clearing",
    "land clearing business automation",
    "grading contractor automation",
    "grading company automation",
    "land clearing lead generation",
    "land clearing quote follow-up",
    "grading contractor lead generation",
    "site prep contractor automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Land Clearing & Grading",
    headline: "Win More Bids. Keep Equipment Running.",
    subhead:
      "Clearing and grading operations are built around fieldwork — but the jobs are won in the office. We automate the lead response, bid follow-up, and project communication that keeps your pipeline full while your crews stay on site.",
    ctaType: "audit",
    industry: "land_clearing",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where clearing and grading operations lose bids before the equipment rolls.",
    items: [
      {
        heading: "Leads call while crews are running equipment",
        body: "You can't step away from an active clearing or grading operation to take a sales call. But the prospect who calls and gets voicemail often calls the next operator on their list instead.",
      },
      {
        heading: "Bids go out and go quiet",
        body: "Clearing and grading jobs have long decision timelines. A bid sent on Friday gets forgotten by Tuesday if there's no system behind it. Project timelines move fast and prospects make decisions without waiting for you to follow up.",
      },
      {
        heading: "Seasonal demand spikes overwhelm manual systems",
        body: "Spring clearing season, post-storm cleanups, and development surges all hit at once. Manual intake and follow-up breaks under volume just when jobs are most plentiful.",
      },
      {
        heading: "No system to re-engage dormant bids and past prospects",
        body: "A developer who didn't use you last season — or a project that stalled due to permitting or financing — may be ready now. Without a reactivation system, those relationships stay dormant until they happen to remember your number.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A bid pipeline that runs while your crew runs.",
    items: [
      {
        heading: "24/7 lead capture and response",
        body: "Every inquiry — call, form, or referral — receives an immediate professional response with a bid request initiated. No leads fall through while you're on site.",
      },
      {
        heading: "Automated bid follow-up sequences",
        body: "Every submitted estimate triggers a multi-step follow-up cadence. Open bids stay visible and active until the prospect books or declines — without manual tracking.",
      },
      {
        heading: "Dormant bid and prospect reactivation",
        body: "Projects that stalled due to permitting or timing, and developers who didn't commit last season, get re-engaged automatically when the window reopens.",
      },
      {
        heading: "Review generation after job completion",
        body: "Every completed project triggers an automated review request — building your Google profile with the kind of recent, specific reviews that win the next bid.",
      },
    ],
  },
  roi: {
    sectionHeading: "The cost of a missed bid when equipment is ready to roll.",
    scenario:
      "A clearing and grading operation estimating 20 jobs per month at a 30% close rate wins 6 projects. Adding an automated follow-up system that lifts close rate to 42% closes 8–9 jobs instead. At $5,000 average project value, those 2–3 additional monthly closes add $120,000–$180,000 in annual revenue without any increase in marketing spend.",
    metrics: [
      { label: "Avg project value (clearing & grading)", value: "$5K", sub: "per mobilization" },
      { label: "Close rate lift with systematic follow-up", value: "+12pts", sub: "from 30% → 42%" },
      { label: "Annual revenue added (2–3 more closes/mo)", value: "$120K+", sub: "no additional ad spend" },
    ],
  },
  crossLinks: [
    { label: "AI Receptionist", href: "/services/ai-receptionist", description: "Never miss a lead while you're on site" },
    { label: "Quote Follow-Up", href: "/services/quotes", description: "Close more of the bids you send" },
    { label: "Builders", href: "/builders", description: "Systems for GCs and production builders" },
  ],
};

export default function LandClearingPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to win more bids without more office work?" />;
}
