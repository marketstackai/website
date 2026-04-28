import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Custom & Production Builders",
  description:
    "Custom and production builders use Market Stack to automate buyer communication, subcontractor coordination, and project updates — building more homes with the same team.",
  keywords: [
    "AI for builders",
    "custom builder automation",
    "production builder systems",
    "homebuilder project management automation",
    "construction communication automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Custom & Production Builders",
    headline: "Build More. Coordinate Less.",
    subhead:
      "Every active build involves owners, subs, suppliers, inspectors, and lenders — all needing information at different times. We automate the communication and coordination layer so your project managers can manage more jobs without more chaos.",
    ctaType: "audit",
    industry: "builder",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where builder operations break down as volume grows.",
    items: [
      {
        heading: "Owner communication requires constant manual effort",
        body: "Buyers want to know where their home is in the build sequence. Without a system for proactive updates, they call your PM — which means your PM is fielding status questions instead of managing the build.",
      },
      {
        heading: "Subcontractor coordination is a full-time job",
        body: "Scheduling trades, confirming site readiness, communicating inspection outcomes, and managing delays requires constant back-and-forth that scales poorly as project volume grows.",
      },
      {
        heading: "Prospect follow-up gets deprioritized when you're busy",
        body: "When projects are active, new prospect inquiries and proposal follow-up take a back seat. Then the pipeline empties and you scramble to fill it — the boom-bust cycle most builders know well.",
      },
      {
        heading: "Change order and approval workflows are manual",
        body: "Documenting scope changes, collecting approvals, and adjusting budgets and timelines manually adds administrative load that grows with each concurrent project.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A build operation that scales without the coordination overhead.",
    items: [
      {
        heading: "Automated owner update sequences",
        body: "Buyers receive proactive milestone updates — framing complete, rough-in finished, drywall started — without your PM generating each communication manually.",
      },
      {
        heading: "Sub scheduling and site-readiness notifications",
        body: "Subcontractor scheduling workflows that confirm upcoming slots, communicate site readiness, and follow up on schedule changes automatically.",
      },
      {
        heading: "Prospect nurture and proposal follow-up",
        body: "Every prospect in your pipeline and every proposal sent gets a systematic follow-up cadence — so your sales pipeline stays active even when your build schedule is full.",
      },
      {
        heading: "Document and approval routing",
        body: "Change orders, selections, and approvals routed to the right parties with automatic reminders until they're signed — no chasing, no lost documents.",
      },
    ],
  },
  roi: {
    sectionHeading: "The coordination cost of adding one more active project.",
    scenario:
      "A custom builder managing 8 active homes handles an average of 45 manual communications per project per month — owner updates, sub confirmations, inspection notifications, change order follow-up. With 8 homes active, that's 360 manual communications per month. Automating 65% of those frees 12–15 hours per PM per month — enough capacity to take on one more project at current staffing.",
    metrics: [
      { label: "Manual communications per active project/mo", value: "45", sub: "across all parties" },
      { label: "PM hours freed per month (65% automation)", value: "12–15h", sub: "at 8 active homes" },
      { label: "Additional projects possible at current headcount", value: "+1–2", sub: "per PM" },
    ],
  },
  crossLinks: [
    { label: "Agentic Workflows", href: "/services/agentic-workflows", description: "Custom multi-party coordination systems" },
    { label: "Document Processing", href: "/services/document-processing", description: "Automate change orders and approvals" },
    { label: "Land Clearing & Grading", href: "/land-clearing", description: "Automation for site prep contractors" },
  ],
};

export default function BuildersPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to build more with the same team?" />;
}
