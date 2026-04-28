import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "Conversational AI",
  description:
    "Engage leads across every channel — web chat, SMS, email, and social media DMs — with AI that qualifies intent, answers questions, and books appointments around the clock.",
  keywords: [
    "Conversational AI",
    "AI web chat",
    "AI SMS automation",
    "automated lead engagement",
    "conversational AI for small business",
    "social media DM automation",
    "multi-channel AI outreach",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "Conversational AI",
    headline: "Every Message Answered. Every Lead Captured.",
    subhead:
      "Leads reach out on your website, by text, via email, and through social media DMs — often at 10pm on a Tuesday. An AI that engages across every channel the moment contact happens turns those messages into booked jobs, with no human in the loop.",
    ctaType: "demo",
    interest: "aiconversational",
    secondaryCtaLabel: "Book a Demo",
  },
  problems: {
    sectionHeading: "Leads are reaching out. You're not there.",
    items: [
      {
        heading: "Website visitors leave without contacting you",
        body: "The average service business website converts less than 2% of visitors. The other 98% leave — often because they had a quick question and no one was there to answer it.",
      },
      {
        heading: "Texts and DMs go unanswered for hours",
        body: "Leads who text or DM your business expect a response in minutes. If they wait hours, they've already moved to the next option in their search results.",
      },
      {
        heading: "Email inquiries sit in your inbox",
        body: "Unread emails from cold or warm leads don't follow up themselves. Every hour that passes before a response lowers the odds of closing the job.",
      },
      {
        heading: "Managing multiple channels manually doesn't scale",
        body: "Web chat, SMS, Instagram DMs, Facebook Messenger, email — no operator can monitor all of them and run a business at the same time.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "Instant, intelligent engagement on every channel.",
    items: [
      {
        heading: "AI web chat on your site",
        body: "The moment a visitor lands, the AI is available to greet them, answer questions, qualify their intent, and guide them straight to a booking — no form, no wait.",
      },
      {
        heading: "Automated SMS response and follow-up",
        body: "Inbound texts get an instant, context-aware reply. The AI qualifies, answers FAQs, and moves the conversation toward a booked appointment.",
      },
      {
        heading: "Email conversation handling",
        body: "New inquiries from email are picked up, replied to, and followed up on a schedule — so no lead ages out in your inbox unattended.",
      },
      {
        heading: "Social media DM automation",
        body: "Instagram and Facebook DMs are routed into the same AI system, keeping your response time under two minutes regardless of which channel a lead uses.",
      },
    ],
  },
  roi: {
    sectionHeading: "More from the leads you're already getting.",
    scenario:
      "A business receiving 80 inbound contacts per month across web, SMS, email, and social — but only responding to 40% within the hour — closes roughly 12 jobs. Closing 90% within 2 minutes, across all channels, lifts that to 20+ closed jobs with the same lead volume. Speed and coverage, not more marketing spend, drive the delta.",
    metrics: [
      { label: "Of buyers choose whoever responds first", value: "60%", sub: "across all channels" },
      { label: "Response time with AI engagement", value: "<2 min", sub: "vs. hours manually" },
      { label: "More lead captures with always-on coverage", value: "2–3×", sub: "same traffic" },
    ],
  },
  crossLinks: [
    { label: "AI Receptionist", href: "/services/ai-receptionist", description: "Handle inbound calls the same way" },
    { label: "Speed-to-Lead", href: "/services/lead-reactivation", description: "Respond the instant a lead comes in" },
    { label: "Home Services", href: "/home-services", description: "Full systems for trades businesses" },
  ],
};

export default function AIConversationalPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to engage every lead, on every channel?" />;
}
