import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Home Services & Trades",
  description:
    "HVAC, roofing, plumbing, electrical, and landscaping businesses use Market Stack to capture more leads, automate follow-up, and grow without adding overhead.",
  keywords: [
    "AI for home services",
    "HVAC business automation",
    "roofing company lead generation",
    "plumbing business automation",
    "home services AI system",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Home Services & Trades",
    headline: "More Jobs. Less Admin. Same Size Team.",
    subhead:
      "Trades businesses win on speed and follow-through. We build AI-powered systems that answer every call, follow up on every quote, and keep your operation running while you're in the field.",
    ctaType: "audit",
    industry: "home_services",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "The operational gaps that cost trades businesses the most.",
    items: [
      {
        heading: "Calls go unanswered while the crew is on site",
        body: "You can't pick up the phone when you're on a roof or under a crawl space. Every missed call is a lead who just called your competitor next.",
      },
      {
        heading: "Estimates sit open for weeks",
        body: "Quoting is the bottleneck. Proposals go out, one follow-up happens, and then the job either materializes or disappears — with no system in between.",
      },
      {
        heading: "Review volume can't keep up with the work quality",
        body: "You're doing great work but your Google profile doesn't show it. Manually asking for reviews is inconsistent, and your competitors are pulling ahead.",
      },
      {
        heading: "Seasonal surges expose how manual everything is",
        body: "Storm season. Heat waves. First freeze. Your phone volume doubles and your system shows its cracks — missed leads, delayed responses, overwhelmed staff.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A growth system built for how trades businesses actually operate.",
    items: [
      {
        heading: "24/7 call answering and lead capture",
        body: "Every inbound call gets handled — after hours, on weekends, during storm surges — by an AI trained on your services, pricing, and service area.",
      },
      {
        heading: "Automated estimate follow-up",
        body: "Every proposal triggers a multi-step follow-up sequence. Open quotes stay visible and active until the prospect books or explicitly declines.",
      },
      {
        heading: "Review generation on autopilot",
        body: "Every completed job triggers a review request at the right moment, building your Google profile consistently without anyone on your team having to remember to ask.",
      },
      {
        heading: "Dormant lead reactivation",
        body: "Your CRM has contacts who inquired and went quiet. A reactivation campaign works that list into new bookings without new ad spend.",
      },
    ],
  },
  roi: {
    sectionHeading: "What leaking leads costs a trades business per year.",
    scenario:
      "An HVAC company generating 90 calls per month misses 20% after hours. At $3,200 average job value and a 25% close rate on recovered calls, that's $14,400 in recoverable monthly revenue from a single automation. Add open-quote follow-up and reactivation, and the annual impact on a $1.5M business is typically $80K–$150K in additional booked revenue.",
    metrics: [
      { label: "After-hours leads lost (avg trades co.)", value: "20%", sub: "of monthly call volume" },
      { label: "Monthly recovery on 90 calls, $3.2K avg", value: "$14.4K", sub: "from AI call handling alone" },
      { label: "Typical annual impact for $1.5M business", value: "$80K+", sub: "across all automations" },
    ],
  },
  crossLinks: [
    { label: "AI Receptionist", href: "/services/ai-receptionist", description: "Answer every call 24/7" },
    { label: "Quote Follow-Up", href: "/services/quotes", description: "Close more of the estimates you send" },
    { label: "Review Automation", href: "/services/reviews", description: "Build your profile automatically" },
    { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Revenue from contacts you already have" },
  ],
};

export default function HomeServicesPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to build your growth system?" />;
}
