import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Soil Scientists & Geotechnical Specialists",
  description:
    "Soil science and geotechnical firms use Market Stack to streamline project intake, client reporting, and proposal follow-up — operating at higher capacity without adding overhead.",
  keywords: [
    "AI for soil scientists",
    "geotechnical firm automation",
    "soil science business systems",
    "environmental consulting automation",
    "perc test workflow automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Soil Science & Geotechnical",
    headline: "More Projects. Less Time on Administrative Work.",
    subhead:
      "Soil scientists and geotechnical specialists operate at the intersection of technical precision and complex project coordination. We automate the intake, reporting, and follow-up layer so your expertise stays focused on the work that requires it.",
    ctaType: "audit",
    industry: "soil-science",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where technical consulting practices leak time and revenue.",
    items: [
      {
        heading: "Intake is slow and heavily manual",
        body: "Collecting site information, ownership documentation, project scope, and access details before scheduling a site visit requires multiple touchpoints that delay project starts.",
      },
      {
        heading: "Report delivery and follow-up is inconsistent",
        body: "Reports take days to deliver after the field work is complete, and there's no systematic follow-up to confirm receipt, address questions, or capture the next scope.",
      },
      {
        heading: "Proposals go out and don't get followed up",
        body: "Developers, engineers, and builders often take weeks to make decisions on soil and geotech proposals. Without a follow-up system, those opportunities age out silently.",
      },
      {
        heading: "Regulatory and permit deadlines create coordination chaos",
        body: "Tracking permit timelines, regulatory submission windows, and client deadlines manually leads to missed milestones that damage relationships and create liability.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "An operation that runs as precisely as your work.",
    items: [
      {
        heading: "Structured project intake automation",
        body: "New project inquiries trigger a comprehensive intake workflow — site details, access instructions, regulatory context — all collected before the first site visit.",
      },
      {
        heading: "Automated report delivery and tracking",
        body: "Reports are automatically delivered to the right parties, receipt is confirmed, and questions are followed up on a defined timeline without manual management.",
      },
      {
        heading: "Proposal follow-up sequences",
        body: "Every submitted proposal triggers a follow-up cadence that keeps your firm visible through the decision period — addressing common questions proactively.",
      },
      {
        heading: "Deadline and milestone tracking automation",
        body: "Permit windows, regulatory submissions, and project milestones are tracked and communicated automatically — reducing the risk of missed deadlines.",
      },
    ],
  },
  roi: {
    sectionHeading: "What administrative overhead costs a technical consulting practice.",
    scenario:
      "A 4-person geotechnical firm handling 12 active projects at any time spends roughly 8 hours per week on intake coordination, status communication, and report delivery logistics. Automating that layer recovers 400 hours per year — enough capacity to add 2–3 additional projects per month to the same team's workload without hiring.",
    metrics: [
      { label: "Weekly hours on intake and coordination (avg)", value: "8h", sub: "4-person firm, 12 active projects" },
      { label: "Annual hours recovered with automation", value: "400h", sub: "equivalent to 10 work weeks" },
      { label: "Additional monthly project capacity", value: "2–3", sub: "without adding headcount" },
    ],
  },
  crossLinks: [
    { label: "Document Processing", href: "/services/document-processing", description: "Automate field report handling" },
    { label: "Professional Services", href: "/professional-services", description: "Systems for technical service firms" },
    { label: "Surveying", href: "/surveying", description: "Automation for adjacent field disciplines" },
  ],
};

export default function SoilSciencePage() {
  return <LandingShell copy={copy} ctaTitle="Ready to take on more projects without adding overhead?" />;
}
