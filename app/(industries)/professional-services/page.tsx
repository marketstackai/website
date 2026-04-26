import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Professional Services Firms",
  description:
    "Law firms, accounting practices, consultants, and agencies use Market Stack to automate intake, follow up consistently, and grow their client base without adding administrative overhead.",
  keywords: [
    "AI for professional services",
    "law firm automation",
    "accounting firm AI",
    "consulting firm automation",
    "professional services lead generation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Professional Services",
    headline: "Run a Tighter Practice. Serve More Clients. Bill More Hours.",
    subhead:
      "Professional services firms lose clients before they start — slow intake response, inconsistent follow-up, and administrative overhead that consumes the time that should go to client work. We fix the operational layer so your team can focus on delivery.",
    ctaType: "audit",
    industry: "professional-services",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where professional service firms lose clients before the relationship starts.",
    items: [
      {
        heading: "Intake response is too slow",
        body: "A prospect who reaches out to two firms and hears back from one within an hour will often make a decision before your callback happens. Speed in the intake window defines first impressions.",
      },
      {
        heading: "Qualified leads fall out of the pipeline",
        body: "Initial consultations happen, proposals go out, and then the prospect goes quiet. Most firms follow up once or twice and stop — leaving revenue on the table when the prospect was simply indecisive, not uninterested.",
      },
      {
        heading: "Administrative work is eating billable time",
        body: "Scheduling, document collection, intake forms, calendar management — your professional staff shouldn't be doing this. But someone has to, and without automation, that someone is your highest-paid people.",
      },
      {
        heading: "Referral and retention programs are informal at best",
        body: "Past clients are your cheapest source of new business. But most firms have no systematic way to stay in front of them, ask for referrals, or re-engage when a need arises.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A system that handles the operational layer so your team handles the work.",
    items: [
      {
        heading: "Automated intake and response",
        body: "Every new inquiry receives an immediate, professional response — intake information collected, consultation scheduled, and contact record created before a person is ever involved.",
      },
      {
        heading: "Proposal and follow-up sequences",
        body: "Every proposal triggers a systematic follow-up cadence. Prospects who don't respond stay in a nurture sequence until they're ready — no manual tracking required.",
      },
      {
        heading: "Document collection and management",
        body: "Intake documents, contracts, and client files are collected and organized automatically — no chasing, no missing files, no email threads as the filing system.",
      },
      {
        heading: "Client retention and referral automation",
        body: "Past clients receive periodic touchpoints, milestone recognition, and referral prompts on a schedule that keeps your firm top of mind without any manual effort.",
      },
    ],
  },
  roi: {
    sectionHeading: "What a slow intake and follow-up system costs a professional services firm.",
    scenario:
      "A law firm or accounting practice receiving 25 new inquiries per month and converting 20% closes 5 new clients. A system that improves response time and follow-up consistency to 35% conversion closes 9 new clients instead — 4 additional clients per month at $2,500 average engagement value is $120,000 in annual revenue from operational improvement alone.",
    metrics: [
      { label: "Of professional service prospects choose who responds fastest", value: "40%", sub: "intake speed defines winner" },
      { label: "Conversion lift with systematic follow-up", value: "+15pts", sub: "from 20% → 35%" },
      { label: "Annual revenue added (25 leads/mo, $2.5K avg)", value: "$120K", sub: "4 more clients/month" },
    ],
  },
  crossLinks: [
    { label: "AI Receptionist", href: "/services/ai-receptionist", description: "Instant intake response 24/7" },
    { label: "Document Processing", href: "/services/document-processing", description: "Automate intake and client documents" },
    { label: "Booking Recovery", href: "/services/booking-recovery", description: "Reduce no-shows on consultations" },
  ],
};

export default function ProfessionalServicesPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to grow without adding overhead?" />;
}
