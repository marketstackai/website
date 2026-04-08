import { Section } from "../../ui/section";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ReactNode } from "react";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: string;
  items?: FAQItemProps[] | false;
}

export default function FAQ({
  title = "Frequently Asked Questions",
  items = [
    {
      question: "What types of businesses do you work with?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          Businesses across all industries that have manual, repetitive
          processes slowing their growth. If your team is spending hours on tasks
          that should take minutes, we can help.
        </p>
      ),
    },
    {
      question: "What are agentic workflows?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px]">
            Agentic workflows are AI agents that autonomously execute multi-step
            tasks — like a tireless employee who never sleeps and never makes
            mistakes. Unlike simple automations, these agents can make decisions, adapt to
            new information, and handle complex processes end-to-end.
          </p>
        </>
      ),
    },
    {
      question: "What does it cost?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px]">
            Every engagement starts with a free{" "}
            <Link
              href={siteConfig.auditUrl}
              className="text-foreground underline"
            >
              Audit
            </Link>
            . From there, pricing is project-based with no recurring fees — you
            pay for the system, not a subscription.
          </p>
        </>
      ),
    },
    {
      question: "How do I know this will actually pay for itself?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          Every engagement starts with diagnosis, not a pitch. Before we build anything, we identify the specific workflows where AI creates measurable impact: leads captured, response time reduced, revenue recovered. We don&apos;t move forward unless the math works.
        </p>
      ),
    },
    {
      question: "We already tried AI tools and they didn't stick. Why would this be different?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          Tools fail when they&apos;re layered on top of broken workflows. A chatbot doesn&apos;t fix a lead follow-up problem if nobody&apos;s looking at the leads. We start with your people and processes first, then build technology that fits how your team actually works. That&apos;s the difference between installing a tool and building a system.
        </p>
      ),
    },
    {
      question: "I'm not technical. Will I be able to use what you build?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          Yes. Everything we build is designed for the people who use it daily, not for engineers. If your team can use email and a calendar, they can use what we build. Training is included in every implementation engagement, and retainer clients get ongoing support as tools evolve.
        </p>
      ),
    },
    {
      question: "Can I start small and upgrade later?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          Absolutely. Many clients start with an audit or workshop, see the value, and upgrade to more robust systems. We make recommendations but let you go at your own pace.
        </p>
      ),
    },
    {
      question: "How long does a typical implementation take?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          It matches the scope. You get instant access to our core systems, while full-scale custom builds are usually deployed and optimized over several weeks to months. We prioritize quick wins that deliver immediate value, then build out more complex systems over time.
        </p>
      ),
    },
    {
      question: "Do I need to hire an AI engineer to maintain this?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          No. We build for reliability and user-friendliness. We also provide ongoing support retainers so you can focus on running your business while we ensure your systems evolve with the technology.
        </p>
      ),
    },
    {
      question: "Can these systems integrate with my existing tools?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px]">
          Yes. We specialize in connecting modern AI workflows to the tools you already use, whether it&apos;s HubSpot, Salesforce, GoHighLevel, Slack, or custom proprietary software.
        </p>
      ),
    },
  ],
}: FAQProps) {
  return (
    <Section>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
