import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Custom Agentic AI Workflows",
  description:
    "When off-the-shelf automation isn't enough. We build custom AI agents and multi-system workflows that handle complex, multi-step operations — tailored to how your business actually runs.",
  keywords: [
    "custom AI workflows",
    "agentic AI automation",
    "multi-system integration",
    "custom AI agents",
    "business process automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Agentic Workflows",
    headline: "When Your Operation Needs More Than a Packaged System.",
    subhead:
      "Some bottlenecks are buried deep in your operation — between systems, across teams, inside complex processes that no off-the-shelf tool was designed to handle. We build custom AI agents that work your specific problem end-to-end.",
    ctaType: "audit",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaInterest: "agentic",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Packaged tools solve generic problems. Yours isn't generic.",
    items: [
      {
        heading: "Your workflow spans systems that don't talk",
        body: "Your CRM, project management, accounting, field tools, and communication platforms each solve their piece — but the handoffs between them are manual, fragile, and slow.",
      },
      {
        heading: "The bottleneck is in the middle of your process",
        body: "Lead capture and invoicing are solved. What's breaking is coordination, qualification logic, document handling, or scheduling — the operational middle that standard tools skip.",
      },
      {
        heading: "Volume has outgrown your current system",
        body: "What worked at 10 jobs a month breaks at 50. The system that got you here can't get you to the next tier without human bandwidth you don't have.",
      },
      {
        heading: "You need AI that takes action, not just generates text",
        body: "You don't need another chatbot. You need an agent that reads a document, makes a decision, routes a contact, and sends a notification — all without a person in the loop.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "AI that works your specific operation, end to end.",
    items: [
      {
        heading: "Multi-system orchestration",
        body: "Agents that read from and write to multiple platforms simultaneously — your CRM, job management software, calendar, email, and messaging tools all talk to each other.",
      },
      {
        heading: "Decision-making logic built in",
        body: "Agents that evaluate conditions, apply your business rules, and take the right action — qualification routing, priority escalation, document classification, bid thresholds.",
      },
      {
        heading: "Document processing and data extraction",
        body: "Agents that read PDFs, contracts, permits, and forms — extract the relevant data, populate your systems, and trigger the next step automatically.",
      },
      {
        heading: "Custom-built and fully owned",
        body: "Every workflow is built to your specifications. No recurring tool licenses for things you don't use. No vendor dependency on a platform that changes its pricing.",
      },
    ],
  },
  roi: {
    sectionHeading: "The compounding value of eliminating manual touchpoints.",
    scenario:
      "A growing operation with 8 manual handoffs per job — qualification, dispatch, confirmations, updates, invoicing, follow-up — processes 40 jobs per month and spends 12+ hours per week on coordination that could be fully automated. Removing those touchpoints with a custom agent system recovers that time, eliminates errors, and unlocks the capacity to handle 60+ jobs without adding headcount.",
    metrics: [
      { label: "Manual touchpoints eliminated per workflow", value: "6–12", sub: "avg across engagements" },
      { label: "Hours reclaimed per week", value: "8–15h", sub: "on coordination and data entry" },
      { label: "Built to your specifications", value: "100%", sub: "no generic templates" },
    ],
  },
  crossLinks: [
    { label: "Document Processing", href: "/services/document-processing", description: "Automate extraction from PDFs and forms" },
    { label: "Tech GTM", href: "/tech-gtm", description: "Custom workflows for B2B SaaS operators" },
    { label: "Builders", href: "/builders", description: "Multi-party coordination for build operations" },
  ],
};

export default function AgenticWorkflowsPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to automate the hard parts?" />;
}
