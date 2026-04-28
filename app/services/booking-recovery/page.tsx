import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Booking & No-Show Recovery Automation",
  description:
    "Reduce no-shows and recover cancelled appointments automatically. Smart reminders, confirmation sequences, and re-booking flows protect your scheduled revenue.",
  keywords: [
    "no-show recovery",
    "booking reminder automation",
    "appointment confirmation",
    "reduce no-shows",
    "rebooking automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Booking Recovery",
    headline: "Stop Losing Revenue to No-Shows and Cancels.",
    subhead:
      "Every no-show is a time slot you can't get back and revenue you already counted. An automated confirmation, reminder, and recovery system slashes no-show rates and fills cancellations before they cost you.",
    ctaType: "demo",
    interest: "bookingrecovery",
    secondaryCtaLabel: "Book a Demo",
  },
  problems: {
    sectionHeading: "Your calendar has leaks you can't see in real time.",
    items: [
      {
        heading: "No-shows cost you the slot and the job",
        body: "When a customer doesn't show, you've committed the time, possibly dispatched a tech, and now the slot is unfillable on short notice.",
      },
      {
        heading: "Late cancellations leave gaps",
        body: "A cancellation 2 hours before an appointment is functionally the same as a no-show — you can't fill that slot without a system already in motion.",
      },
      {
        heading: "Manual reminders are inconsistent",
        body: "Relying on a person to call and confirm appointments works until it doesn't — and when it fails, you find out at the appointment time.",
      },
      {
        heading: "Cancellations don't automatically trigger rebooking",
        body: "When someone cancels, most businesses just lose the revenue. An automated rebooking prompt can recover the job before the customer finds a competitor.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A confirmation and recovery system that never misses a beat.",
    items: [
      {
        heading: "Multi-touch confirmation sequences",
        body: "Every appointment triggers an automated confirmation: SMS at booking, email at 48 hours, reminder at 24 hours, and a final prompt 2 hours before.",
      },
      {
        heading: "Instant rebooking on cancellation",
        body: "When someone cancels, they immediately receive a reschedule link — capturing the job before they look elsewhere.",
      },
      {
        heading: "Waitlist backfill",
        body: "Cancellations automatically trigger outreach to prospects on a waitlist, filling the slot with someone who's already interested.",
      },
      {
        heading: "Post-no-show re-engagement",
        body: "Customers who don't show receive a follow-up that re-engages them without burning the relationship — often recovering the booking within 24 hours.",
      },
    ],
  },
  roi: {
    sectionHeading: "What no-shows are actually costing you.",
    scenario:
      "A business running 100 appointments per month with an 18% no-show rate is losing 18 slots. At $450 average service value, that's $8,100 per month in walk-off revenue. A confirmation and recovery system that cuts no-shows to 6% recovers $5,400 of that every month — with no new marketing spend.",
    metrics: [
      { label: "Avg no-show rate without a reminder system", value: "15–20%", sub: "of appointments" },
      { label: "No-show reduction with automated confirmations", value: "60%+", sub: "fewer missed appointments" },
      { label: "Monthly recovery (100 appts, $450 avg)", value: "$5.4K", sub: "at 12-point no-show reduction" },
    ],
  },
  crossLinks: [
    { label: "AI Receptionist", href: "/services/ai-receptionist", description: "Handle inbound calls and book appointments" },
    { label: "Quote Follow-Up", href: "/services/quotes", description: "Keep open estimates from going cold" },
    { label: "Real Estate", href: "/real-estate", description: "Booking systems for agents and brokerages" },
  ],
};

export default function BookingRecoveryPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to protect your scheduled revenue?" />;
}
