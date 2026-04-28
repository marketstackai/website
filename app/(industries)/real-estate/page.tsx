import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Real Estate Businesses",
  description:
    "Real estate brokerages, agents, and investors use Market Stack to automate lead response, nurture prospects, and close more deals without expanding their team.",
  keywords: [
    "AI for real estate",
    "real estate lead automation",
    "real estate CRM automation",
    "automated lead follow-up real estate",
    "real estate business systems",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Real Estate",
    headline: "Respond First. Nurture Every Lead. Close More Deals.",
    subhead:
      "In real estate, the agent who responds first wins the client. We build AI-powered systems that make instant response automatic, keep every lead warm through a long sales cycle, and free your team for the work that actually closes deals.",
    ctaType: "audit",
    industry: "real_estate",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Real estate pipelines leak at every stage.",
    items: [
      {
        heading: "New leads don't get a response within minutes",
        body: "Studies consistently show that responding to a real estate inquiry within 5 minutes is 21× more effective than responding within 30. Most teams respond in hours.",
      },
      {
        heading: "Long cycles mean leads go cold without consistent nurture",
        body: "A buyer who's 6 months out is a warm prospect — but only if you're staying in front of them. Without a system, they forget you and go with whoever was consistent.",
      },
      {
        heading: "Listing and showing coordination is manual and time-consuming",
        body: "Scheduling tours, sending confirmations, following up after showings, requesting feedback — your team spends hours per week on coordination that produces no new revenue.",
      },
      {
        heading: "Past clients and dormant leads aren't being worked",
        body: "Your database of past buyers, sellers, and unconverted inquiries represents a referral and reactivation goldmine that most real estate businesses never systematically tap.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A system that works every lead, at every stage.",
    items: [
      {
        heading: "Instant automated response to every inquiry",
        body: "The moment a lead submits a form, calls, or messages, they get a personalized response — no matter the time of day.",
      },
      {
        heading: "Long-cycle nurture sequences",
        body: "Leads at every stage — active buyer, future seller, investor — get the right content at the right cadence to keep your business top of mind until they're ready to move.",
      },
      {
        heading: "Showing and appointment automation",
        body: "Confirmations, reminders, and follow-up after showings handled automatically — so your team focuses on relationships, not logistics.",
      },
      {
        heading: "Referral and reactivation campaigns",
        body: "Past clients receive automated check-ins timed to lifecycle events. Dormant prospects get re-engaged when market conditions change in their favor.",
      },
    ],
  },
  roi: {
    sectionHeading: "The value of a faster, more consistent pipeline.",
    scenario:
      "A brokerage generating 60 new leads per month and converting at 3% closes 2 transactions. A system that improves response time, nurture consistency, and past-client reactivation to reach a 6% conversion rate closes 4 transactions instead — adding 2 deals per month at $8,500 average commission is $204,000 in additional annual GCI from operational improvement alone.",
    metrics: [
      { label: "More effective at 5-min vs 30-min response", value: "21×", sub: "response time advantage" },
      { label: "Conversion lift with systematic nurture", value: "2×", sub: "from 3% → 6%" },
      { label: "Annual GCI added (60 leads/mo, $8.5K avg)", value: "$204K", sub: "2 more closes/month" },
    ],
  },
  crossLinks: [
    { label: "AI Receptionist", href: "/services/ai-receptionist", description: "Instant response to every inquiry" },
    { label: "Booking Recovery", href: "/services/booking-recovery", description: "Reduce no-shows on showings and calls" },
    { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Work your dormant buyer and seller database" },
  ],
};

export default function RealEstatePage() {
  return <LandingShell copy={copy} ctaTitle="Ready to close more deals with fewer manual steps?" />;
}
