import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for E-Commerce Brands",
  description:
    "DTC brands and Shopify operators use Market Stack to recover abandoned carts, reactivate past buyers, and build automated revenue streams without scaling headcount.",
  keywords: [
    "AI for ecommerce",
    "ecommerce automation",
    "abandoned cart recovery",
    "Shopify automation",
    "DTC brand automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "E-Commerce",
    headline: "More Revenue From the Customers You Already Have.",
    subhead:
      "Acquisition costs keep climbing. The highest-leverage growth move for a DTC brand isn't more ads — it's recovering the revenue already leaving your store and building automated systems that monetize your existing customer base.",
    ctaType: "audit",
    industry: "e-commerce",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where e-commerce revenue leaks before it ever converts.",
    items: [
      {
        heading: "Abandoned carts with no recovery system",
        body: "The average e-commerce store abandons 70% of carts. Without a structured recovery sequence, those sessions — and the ad spend that drove them — produce nothing.",
      },
      {
        heading: "One-time buyers who never return",
        body: "Your existing customer list is your most valuable acquisition asset. Without a post-purchase nurture sequence, most customers buy once and move on.",
      },
      {
        heading: "Customer support is a manual time sink",
        body: "Order status, returns, shipping questions, product FAQs — your support queue is filled with inquiries that a well-configured AI could handle instantly at scale.",
      },
      {
        heading: "Segment-blind email marketing",
        body: "Sending the same broadcast to your entire list treats a first-time buyer the same as a VIP customer. Without segmentation and automation, your email performance plateaus.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "Automated revenue recovery and retention at every stage.",
    items: [
      {
        heading: "Cart abandonment recovery sequences",
        body: "Multi-step email and SMS sequences that recover high-intent shoppers at optimized intervals — with personalization that addresses the most common friction points.",
      },
      {
        heading: "Post-purchase nurture and replenishment",
        body: "Automated sequences that thank, upsell, cross-sell, and solicit reviews — all triggered by purchase behavior and timed to the natural repurchase window for your product.",
      },
      {
        heading: "Win-back campaigns for lapsed customers",
        body: "Customers who haven't purchased in 90+ days get a structured re-engagement campaign — offers, content, and urgency signals timed to their purchase history.",
      },
      {
        heading: "AI-assisted customer support",
        body: "An AI trained on your product catalog, policies, and FAQs handles the repetitive support volume instantly, freeing your team for complex issues.",
      },
    ],
  },
  roi: {
    sectionHeading: "The revenue sitting in your existing traffic and customer base.",
    scenario:
      "A DTC brand doing $600K/year with a 68% cart abandonment rate and no recovery system is leaving roughly $180K in potential revenue on the table annually from abandoned carts alone. A recovery sequence converting 4% of abandoned carts adds $25K–$50K per quarter without a single new visitor — from traffic you already paid to acquire.",
    metrics: [
      { label: "Average e-commerce cart abandonment rate", value: "70%", sub: "without recovery" },
      { label: "Cart recovery rate with automated sequences", value: "4–8%", sub: "of abandoned carts" },
      { label: "Quarterly cart recovery (on $600K revenue)", value: "$25K+", sub: "from existing traffic" },
    ],
  },
  crossLinks: [
    { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Win back lapsed customers systematically" },
    { label: "Review Automation", href: "/services/reviews", description: "Build product reviews automatically post-purchase" },
    { label: "Converational AI", href: "/services/ai-conversational", description: "Convert more of the visitors already on your site" },
  ],
};

export default function ECommercePage() {
  return <LandingShell copy={copy} ctaTitle="Ready to recover the revenue already leaving your store?" />;
}
