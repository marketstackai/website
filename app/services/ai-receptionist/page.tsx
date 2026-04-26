import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Receptionist for Small Business",
  description:
    "Never miss a lead. Our AI Receptionist answers calls 24/7, qualifies prospects, and books appointments — trained on your specific business.",
  keywords: [
    "AI receptionist",
    "AI receptionist for small business",
    "automated call answering",
    "AI appointment booking",
    "24/7 receptionist",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "AI Receptionist",
    headline: "Every Call Answered. Every Lead Captured.",
    subhead:
      "Your AI Receptionist qualifies inbound calls, answers questions about your business, and books appointments around the clock — no voicemail, no missed opportunities.",
    ctaType: "demo",
    interest: "aireceptionist",
    primaryCtaLabel: "Book a Demo",
    secondaryCtaLabel: "Start Your AI Audit",
    secondaryCtaHref: "/audit/start",
  },
  problems: {
    sectionHeading: "Leads don't wait. Most businesses make them.",
    items: [
      {
        heading: "Calls go to voicemail after hours",
        body: "A third of your leads call outside business hours. Most won't leave a message — they move on to whoever picks up next.",
      },
      {
        heading: "Callbacks happen too late",
        body: "Responding more than five minutes after a new inquiry drops your booking rate by up to 80%. By morning, that lead has already chosen someone else.",
      },
      {
        heading: "Staff time wasted on repetitive questions",
        body: "Pricing, availability, service area, process — your team answers the same questions dozens of times a week. That's billable time on hold.",
      },
      {
        heading: "No coverage during peak demand",
        body: "When a storm rolls through or a pipe bursts, your phone rings while your team is in the field. Missed calls in those moments are missed jobs.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A front desk that never clocks out.",
    items: [
      {
        heading: "24/7 inbound call handling",
        body: "Every call — daytime, evening, weekend, holiday — gets answered by an AI trained to speak on your behalf.",
      },
      {
        heading: "Instant lead qualification",
        body: "The AI asks the right questions, scores the lead, and routes hot prospects to you immediately while nurturing lower-urgency inquiries.",
      },
      {
        heading: "Direct-to-calendar booking",
        body: "Qualified leads book appointments without human involvement. Your calendar fills while you're on the job.",
      },
      {
        heading: "Trained on your business",
        body: "Services, pricing, service area, FAQs — the AI answers accurately because it's built on your actual business information.",
      },
    ],
  },
  roi: {
    sectionHeading: "What missed calls actually cost.",
    scenario:
      "A service business taking 80 calls per month sends roughly 18 to voicemail after hours. At $3,000 average job value and a 25% booking rate, that's $13,500 in potential revenue slipping to a competitor every month — not because the lead wasn't interested, but because no one answered.",
    metrics: [
      { label: "Calls missed after hours (avg)", value: "22%", sub: "of total inbound volume" },
      { label: "Booking rate drop after 5-min delay", value: "80%", sub: "vs. instant response" },
      { label: "Potential monthly recovery", value: "$10K+", sub: "at $3K avg job, 80 leads/mo" },
    ],
  },
  crossLinks: [
    { label: "Converational AI", href: "/services/ai-conversational", description: "Engage leads across every channel" },
    { label: "Home Services", href: "/home-services", description: "Systems built for trades" },
    { label: "Professional Services", href: "/professional-services", description: "Intake automation for firms" },
  ],
};

export default function AIReceptionistPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to answer every call?" />;
}
