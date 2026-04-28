import { LandingShell } from "@/components/landing/landing-shell";
import type { LandingPageCopy } from "@/lib/landing/types";

export const metadata = {
  title: "AI Automation for B2B SaaS & Tech GTM Teams",
  description:
    "Founders, RevOps leaders, and growth teams at B2B SaaS companies use Market Stack to automate the GTM layer — pipeline velocity, outbound sequences, and lead-to-close operations.",
  keywords: [
    "AI for B2B SaaS",
    "sales automation for SaaS",
    "GTM automation",
    "RevOps automation",
    "B2B pipeline automation",
  ],
};

const copy: LandingPageCopy = {
  hero: {
    eyebrow: "B2B SaaS & Tech GTM",
    headline: "More Pipeline. Same SDR Headcount.",
    subhead:
      "Your SDRs are spending 40% of their time on tasks that should be automated. We build the GTM infrastructure layer that handles research, sequences, CRM hygiene, and follow-up — so your team spends its time on conversations that close.",
    ctaType: "audit",
    industry: "tech_gtm",
    primaryCtaLabel: "Start Your AI Audit",
    secondaryCtaLabel: "Book a Discovery Call",
    secondaryCtaHref: "/book",
  },
  problems: {
    sectionHeading: "Where B2B GTM operations break down at scale.",
    items: [
      {
        heading: "SDR time wasted on manual CRM work",
        body: "Contact research, CRM data entry, meeting prep notes, sequence enrollment — the administrative layer of outbound eats 30–40% of rep capacity before a single call is made.",
      },
      {
        heading: "No system for leads that aren't ready to buy",
        body: "A prospect who's a fit but not ready now gets one or two touches and then disappears from your pipeline. Without a long-term nurture system, you're re-acquiring the same leads 6 months later.",
      },
      {
        heading: "Inbound leads sit too long before first touch",
        body: "Even in a software context, speed-to-first-touch matters. A trial signup or demo request that waits 24 hours for a reply converts dramatically worse than one that gets a response in minutes.",
      },
      {
        heading: "Post-demo follow-up is inconsistent",
        body: "After a demo, most teams send one email and wait. A structured multi-touch follow-up cadence that addresses objections and maintains momentum dramatically lifts close rate.",
      },
    ],
  },
  outcomes: {
    sectionHeading: "A GTM layer that moves as fast as your product.",
    items: [
      {
        heading: "Automated inbound response and qualification",
        body: "Trial signups, demo requests, and form fills get an immediate, personalized response — qualified and routed to the right rep before your team logs in Monday morning.",
      },
      {
        heading: "Long-cycle nurture for not-yet-ready prospects",
        body: "Prospects who aren't ready today get segmented into a nurture track — content, case studies, and check-ins timed to their lifecycle stage until they re-engage.",
      },
      {
        heading: "Post-demo and proposal follow-up sequences",
        body: "Every demo triggers a structured follow-up sequence. Objections get addressed proactively, urgency gets built, and deals don't sit in limbo.",
      },
      {
        heading: "Custom agentic workflows for unique GTM problems",
        body: "Account research automation, multi-channel outbound orchestration, CRM enrichment pipelines — the bespoke GTM infrastructure that solves the specific bottleneck in your motion.",
      },
    ],
  },
  roi: {
    sectionHeading: "What SDR capacity recaptured from manual tasks looks like.",
    scenario:
      "A 3-person SDR team each spending 12 hours per week on automatable tasks — CRM work, sequence management, meeting prep — is operating at 60% efficiency. Recapturing that 12 hours per person adds 36 hours per week of selling time to your team. At one meeting per 3 hours of prospecting, that's 12 additional meetings per week without a new hire.",
    metrics: [
      { label: "SDR time spent on automatable tasks (avg)", value: "40%", sub: "of weekly capacity" },
      { label: "Selling hours recaptured per rep per week", value: "12h", sub: "at 40% recovery" },
      { label: "Additional meetings per week (3-person team)", value: "12", sub: "no new headcount" },
    ],
  },
  crossLinks: [
    { label: "Agentic Workflows", href: "/services/agentic-workflows", description: "Custom GTM automation for complex motions" },
    { label: "GEO", href: "/services/geo", description: "Optimize for AI-powered B2B discovery" },
    { label: "Converational AI", href: "/services/ai-conversational", description: "Convert inbound traffic instantly" },
  ],
};

export default function TechGTMPage() {
  return <LandingShell copy={copy} ctaTitle="Ready to build a faster GTM operation?" />;
}
