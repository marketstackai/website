import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for Manufactured Home Dealers",
  description:
    "Manufactured home dealers use Market Stack to automate lead follow-up, financing coordination, and customer communication — closing more deals through a long, complex sales cycle.",
  keywords: [
    "AI for manufactured homes",
    "manufactured home dealer automation",
    "mobile home dealer lead generation",
    "manufactured housing sales automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Manufactured Homes",
    headline: "Close More Homes. Lose Fewer Buyers to the Wait.",
    subhead:
      "Manufactured home buyers have long consideration windows and complex financing situations. We build systems that keep every prospect warm through the full cycle — so when they're ready to buy, you're the one they remember.",
    ctaType: "audit",
    industry: "manufactured-homes",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where manufactured home dealers lose buyers in a long sales cycle.",
    items: [
      {
        heading: "Long consideration timelines kill momentum",
        body: "A buyer researching for 3–6 months forgets about dealers who don't stay in front of them. Most dealers follow up twice and then let the relationship go cold.",
      },
      {
        heading: "Financing complexity causes drop-off",
        body: "Buyers who hit financing obstacles often go quiet — not because they've given up, but because they're waiting for their situation to improve. Without a follow-up system, you lose them when they're finally ready.",
      },
      {
        heading: "No process to re-engage buyers who didn't close",
        body: "Prospects who looked but didn't buy 6 months ago may be in a completely different position now. Without systematic re-engagement, you never find out.",
      },
      {
        heading: "New inquiries wait too long for response",
        body: "An online inquiry for a home model that sits 4 hours before a response means the buyer has already visited two competitor sites. Speed in the first response is a significant competitive advantage.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A system that keeps buyers moving toward a decision.",
    items: [
      {
        heading: "Instant response to every inquiry",
        body: "Every new lead — web form, call, or walk-in follow-up — receives an immediate professional response with floor plan options, financing information, and a next-step invitation.",
      },
      {
        heading: "Long-cycle nurture sequences",
        body: "Buyers who aren't ready to decide today stay in an automated nurture track — new inventory alerts, financing tips, and market updates — until they're ready to move.",
      },
      {
        heading: "Financing re-engagement",
        body: "Buyers who paused due to financing obstacles are automatically re-engaged at defined intervals — or when your financing partners announce new programs that may help.",
      },
      {
        heading: "Past-buyer referral and reactivation",
        body: "Happy homeowners are systematically asked for referrals and re-engaged for additions, land-home packages, or future purchases.",
      },
    ],
  },
  roi: {
    sectionHeading: "What happens to the buyers who don't close in month one.",
    scenario:
      "A manufactured home dealer generating 40 qualified inquiries per month and closing 8% sells 3 homes. A nurture and re-engagement system that keeps long-cycle buyers warm and surfaces financing-ready prospects lifts conversion to 13% — closing 5 homes instead. At $65,000 average sale and a 10% margin, those 2 additional monthly closes add $156,000 in annual gross margin.",
    metrics: [
      { label: "Avg manufactured home sale value", value: "$65K", sub: "new home + installation" },
      { label: "Conversion lift with systematic long-cycle nurture", value: "+5pts", sub: "from 8% → 13%" },
      { label: "Annual gross margin added (2 more closes/mo)", value: "$156K", sub: "at 10% margin" },
    ],
  },
  crossLinks: [
    { label: "Converational AI", href: "/services/ai-conversational", description: "Convert website visitors instantly" },
    { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Re-engage buyers who paused" },
    { label: "Lenders", href: "/lenders", description: "Automation for the financing side" },
  ],
};

export default function ManufacturedHomesPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to close more buyers through the full cycle?" />;
}
