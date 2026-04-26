import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Document Processing Automation",
  description:
    "Stop re-entering data by hand. AI-powered document processing extracts, routes, and files information from PDFs, contracts, permits, and forms automatically.",
  keywords: [
    "document processing automation",
    "AI document extraction",
    "automated data entry",
    "PDF automation",
    "contract processing automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Document Processing",
    headline: "Stop Typing What a Machine Can Read.",
    subhead:
      "Contracts, permits, applications, invoices, inspection reports — your operation runs on documents that someone is processing by hand. We automate the extraction, routing, and filing so your team can stop re-entering data and start using it.",
    ctaType: "audit",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
    secondaryCtaInterest: "documentprocessing",
  },
  problems: {
    sectionHeading: "Manual document handling is your hidden bottleneck.",
    items: [
      {
        heading: "Data entry is eating billable hours",
        body: "Every form, permit, or contract that gets manually re-entered into your system is 15–30 minutes of staff time that produces nothing new.",
      },
      {
        heading: "Re-entry errors compound downstream",
        body: "A wrong address, misread job number, or missed field doesn't just create a correction task — it causes miscommunication, delays, and rework that costs far more than the original mistake.",
      },
      {
        heading: "Documents sit in inboxes waiting for processing",
        body: "When a person has to touch every document, backlogs form. A permit that should take one day to process sits three days waiting for someone's attention.",
      },
      {
        heading: "No audit trail or structured storage",
        body: "Documents processed manually often live in email threads, shared drives with no naming convention, or never get filed at all — making retrieval slow and compliance difficult.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "Documents processed, filed, and actioned automatically.",
    items: [
      {
        heading: "AI extraction from any document type",
        body: "PDFs, scanned forms, contracts, invoices, permit applications — the agent reads the document, extracts the relevant fields, and populates your systems without human review for clean submissions.",
      },
      {
        heading: "Automatic routing and escalation",
        body: "Documents are routed to the right person, system, or workflow based on their content — approvals, follow-ups, and exceptions handled without a manual sort.",
      },
      {
        heading: "System-of-record population",
        body: "Extracted data flows directly into your CRM, project management tool, or internal database — eliminating the re-entry step entirely.",
      },
      {
        heading: "Structured archive with instant retrieval",
        body: "Every processed document is categorized, tagged, and stored in a structured way that makes retrieval in seconds instead of minutes.",
      },
    ],
  },
  roi: {
    sectionHeading: "What manual document processing is costing you.",
    scenario:
      "A company processing 80 documents per month — applications, permits, contracts, inspection reports — spends an average of 20 minutes per document on manual entry and filing. That's 27 hours per month of staff time on a task that can be fully automated. At a $30/hour all-in labor rate, that's $810 per month in pure labor cost, before accounting for errors, rework, and delays.",
    metrics: [
      { label: "Minutes per document (manual avg)", value: "20 min", sub: "entry + filing" },
      { label: "Processing time with AI extraction", value: "< 60s", sub: "per document" },
      { label: "Monthly labor cost recovered (80 docs)", value: "$810+", sub: "at $30/hr all-in" },
    ],
  },
  crossLinks: [
    { label: "Agentic Workflows", href: "/services/agentic-workflows", description: "Custom multi-system automation" },
    { label: "Lenders", href: "/lenders", description: "Document automation for loan processing" },
    { label: "Surveying", href: "/surveying", description: "Field report and permit automation" },
  ],
};

export default function DocumentProcessingPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to eliminate manual document handling?" />;
}
