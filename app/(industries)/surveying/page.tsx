import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Land Surveying Firms",
  description:
    "Land surveying firms use Market Stack to automate project intake, field-to-office communication, and client updates — delivering faster turnarounds without adding staff.",
  keywords: [
    "AI for land surveyors",
    "surveying firm automation",
    "land survey business systems",
    "surveying project management automation",
    "ALTA survey workflow automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Land Surveying",
    headline: "Faster Turnarounds. Less Administrative Friction.",
    subhead:
      "Surveying firms compete on precision and turnaround time. We automate the intake, coordination, and client communication layer so your surveyors stay in the field and your office runs at full efficiency.",
    ctaType: "audit",
    industry: "surveying",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where surveying operations lose time and clients.",
    items: [
      {
        heading: "Project intake requires too many back-and-forth touchpoints",
        body: "Collecting property information, ownership documentation, access details, and scope confirmation for a new project takes 3–5 emails and a week before the survey is even scheduled.",
      },
      {
        heading: "Client communication during a project is manual and inconsistent",
        body: "Clients want to know where their project stands. Without a system for proactive updates, your team fields status calls that interrupt fieldwork and slow delivery.",
      },
      {
        heading: "Field-to-office data handoff creates re-entry work",
        body: "Notes from the field, point data, and observations that need to be entered into your office systems represent hours of manual work that delays deliverable production.",
      },
      {
        heading: "Quote follow-up is an afterthought",
        body: "Surveying proposals sit in inbox limbo. When a developer or attorney decides to move forward three weeks after the quote, they often go to whoever followed up — not whoever sent the best proposal.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "An operation that intake faster, delivers faster, and follows up automatically.",
    items: [
      {
        heading: "Automated project intake",
        body: "New project inquiries trigger a structured intake workflow — ownership info collected, access details confirmed, scope clarified — before the first human touchpoint.",
      },
      {
        heading: "Proactive client status updates",
        body: "Clients receive automated updates at each project milestone — scheduling confirmation, field completion, processing status, and delivery notification — without your office generating them manually.",
      },
      {
        heading: "Proposal follow-up sequences",
        body: "Every submitted quote triggers a follow-up cadence. Open proposals stay active until the client responds — no manual tracking, no forgotten opportunities.",
      },
      {
        heading: "Document delivery and archive automation",
        body: "Final deliverables — plats, reports, CAD files — are automatically organized, delivered to the right parties, and filed in a structured archive for future retrieval.",
      },
    ],
  },
  roi: {
    sectionHeading: "The operational cost of manual coordination in a surveying firm.",
    scenario:
      "A 6-person surveying firm managing 15 active projects at any time handles an average of 35 manual communications per project across its lifecycle — intake, scheduling, status updates, deliverable requests, and invoicing. Automating 70% of those touchpoints recovers 12+ hours per week across the office, which translates directly to more projects processed per month without increasing headcount.",
    metrics: [
      { label: "Manual touchpoints per project (avg)", value: "35", sub: "across the project lifecycle" },
      { label: "Weekly hours reclaimed with automation", value: "12h", sub: "at 70% automation rate" },
      { label: "Additional projects processed per month", value: "2–3", sub: "from same team capacity" },
    ],
  },
  crossLinks: [
    { label: "Document Processing", href: "/services/document-processing", description: "Automate field report and permit handling" },
    { label: "Quote Follow-Up", href: "/services/quotes", description: "Keep proposals active until they close" },
    { label: "Professional Services", href: "/professional-services", description: "Systems for technical service firms" },
  ],
};

export default function SurveyingPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to process more projects without adding staff?" />;
}
