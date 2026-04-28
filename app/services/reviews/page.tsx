import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Review Generation",
  description:
    "Automatically request, monitor, and respond to reviews across Google, Yelp, and more — turning happy customers into your most powerful growth channel.",
  keywords: [
    "review automation",
    "automated review requests",
    "Google review automation",
    "reputation management",
    "review generation for small business",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Review Automation",
    headline: "More Reviews. Less Chasing. Better Rankings.",
    subhead:
      "Your best customers rarely leave reviews without being asked. An automated review system makes the ask at exactly the right moment — and turns happy customers into your most effective marketing channel.",
    ctaType: "demo",
    interest: "reviews",
    secondaryCtaLabel: "Book a Demo",
  },
  problems: {
    sectionHeading: "Your reputation is lagging behind the work you're doing.",
    items: [
      {
        heading: "Happy customers don't leave reviews on their own",
        body: "Research consistently shows that satisfied customers need a prompt. Without a system, the reviews you get are random, sparse, and often from the people who were unhappy enough to find the form themselves.",
      },
      {
        heading: "Manually asking for reviews is inconsistent",
        body: "Relying on your team to ask every customer at the right moment means it happens sometimes, forgot most of the time, and never at the optimal point in the customer journey.",
      },
      {
        heading: "Low review counts hurt search rankings",
        body: "Google uses review recency, volume, and rating as local ranking signals. A business with 12 reviews loses searches to a competitor with 120 — even if the service quality is the same.",
      },
      {
        heading: "Negative reviews go unanswered",
        body: "Ignoring a negative review signals to every future customer that you don't care. But monitoring and responding manually takes time most operators don't have.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A reputation system that runs on its own.",
    items: [
      {
        heading: "Automated post-job review requests",
        body: "The moment a job closes or a service is complete, the customer gets a well-timed review request via SMS or email — no manual action required.",
      },
      {
        heading: "Multi-platform coverage",
        body: "Requests direct customers to Google, Yelp, Facebook, or wherever your reviews matter most, based on what you're optimizing for.",
      },
      {
        heading: "AI-assisted response drafts",
        body: "Positive or negative, every review gets a thoughtful response drafted for your approval — maintaining your voice without consuming your time.",
      },
      {
        heading: "Review velocity that compounds",
        body: "A consistent review engine builds your profile month over month. More reviews mean better search ranking, more trust, and higher conversion on every lead.",
      },
    ],
  },
  roi: {
    sectionHeading: "Reviews are the cheapest marketing channel you have.",
    scenario:
      "A local service business with 28 reviews gets 40 calls per month from search. A competitor in the same area with 180 reviews gets 130 calls per month. The difference isn't price, service quality, or ad spend — it's review volume and recency. An automated review system closes that gap within 60–90 days.",
    metrics: [
      { label: "Of buyers read reviews before choosing", value: "90%", sub: "local services" },
      { label: "More calls for businesses with 100+ reviews", value: "3×", sub: "vs. under 30" },
      { label: "Time to first review with automation", value: "48h", sub: "after job completion" },
    ],
  },
  crossLinks: [
    { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Re-engage past customers" },
    { label: "Local SEO", href: "/services/seo", description: "Reviews are part of the ranking equation" },
    { label: "Home Services", href: "/home-services", description: "Full growth systems for trades" },
  ],
};

export default function ReviewAutomationPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to build your review engine?" />;
}
