import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Construction & Land Lenders",
  description:
    "Construction lenders, hard-money lenders, and land lenders use Market Stack to automate borrower intake, document processing, and pipeline follow-up — closing more loans with less manual work.",
  keywords: [
    "AI for lenders",
    "construction lender automation",
    "hard money lender automation",
    "loan pipeline automation",
    "document processing for lenders",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Construction & Land Lenders",
    headline: "Process More Loans. Chase Less Paper.",
    subhead:
      "Lending operations run on documents, timelines, and follow-up — all of which can be automated. We build AI-powered systems that handle borrower intake, document collection, and pipeline management so your team focuses on deals, not administration.",
    ctaType: "audit",
    industry: "lenders",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where lending operations lose time and deals.",
    items: [
      {
        heading: "Borrower intake is slow and manual",
        body: "Collecting applications, financial documents, and project information requires back-and-forth that stretches the intake window by days — frustrating borrowers and delaying your ability to underwrite.",
      },
      {
        heading: "Document collection is a constant chase",
        body: "Missing a bank statement, an appraisal, a title document — the follow-up chain to collect everything needed for a file is repetitive, time-consuming, and easy to let slip.",
      },
      {
        heading: "Pipeline follow-up is inconsistent",
        body: "Borrowers who submit an application and don't hear back promptly move to another lender. Consistent, professional communication through the pipeline is table stakes that most teams struggle to maintain manually.",
      },
      {
        heading: "Data from documents has to be re-entered manually",
        body: "Extracting data from tax returns, bank statements, appraisals, and permits into your LOS or spreadsheet is error-prone, slow, and the kind of work that shouldn't require a human.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A lending operation that processes faster and loses fewer deals.",
    items: [
      {
        heading: "Automated borrower intake",
        body: "New inquiries receive an immediate, professional response — application links sent, intake checklist provided, and follow-up triggered automatically for any missing items.",
      },
      {
        heading: "Document collection and extraction",
        body: "AI agents collect, organize, and extract data from borrower documents — reducing manual data entry and ensuring nothing is missing before underwriting begins.",
      },
      {
        heading: "Pipeline communication sequences",
        body: "Every stage of the loan pipeline triggers the appropriate borrower communication — status updates, next-step prompts, and condition clearance requests sent automatically.",
      },
      {
        heading: "Dormant borrower reactivation",
        body: "Past applicants who didn't close get re-engaged when rates or market conditions shift in their favor — converting your existing database into new originations.",
      },
    ],
  },
  roi: {
    sectionHeading: "What manual intake and document collection costs a lending operation.",
    scenario:
      "A construction lender processing 25 loan applications per month spends an average of 45 minutes per file on document collection follow-up and manual data extraction — nearly 19 hours per month on administrative tasks that produce no new volume. Automating that layer recovers the time and reduces application-to-close timelines by 3–5 days, which is often the difference between winning and losing the deal.",
    metrics: [
      { label: "Hours/month on manual intake and document chase", value: "19h", sub: "at 25 apps/mo" },
      { label: "Application-to-close time reduction", value: "3–5 days", sub: "with automated follow-up" },
      { label: "Borrower conversion lift with faster response", value: "30%+", sub: "from same inquiry volume" },
    ],
  },
  crossLinks: [
    { label: "Document Processing", href: "/services/document-processing", description: "AI extraction from loan documents" },
    { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Re-engage past applicants" },
    { label: "Agentic Workflows", href: "/services/agentic-workflows", description: "Custom pipeline automation" },
  ],
};

export default function LendersPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to process more loans with less manual work?" />;
}
