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
  title = "Questions & Answers",
  items = [
    {
      question: "What is an Operations Audit?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          We analyze your current workflows, identify bottlenecks, and deliver a
          clear roadmap for automation. It&apos;s free, no-commitment, and
          designed to show you exactly where AI can save you time and money.
        </p>
      ),
    },
    {
      question: "What types of businesses do you work with?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Small businesses across all industries that have manual, repetitive
          processes slowing their growth. If your team is spending hours on tasks
          that should take minutes, we can help.
        </p>
      ),
    },
    {
      question: "What are agentic workflows?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            Agentic workflows are AI agents that autonomously execute multi-step
            tasks — like a tireless employee who never sleeps and never makes
            mistakes.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            Unlike simple automations, these agents can make decisions, adapt to
            new information, and handle complex processes end-to-end.
          </p>
        </>
      ),
    },
    {
      question: "How long does implementation take?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
          Most clients see their first automated pipeline live within 2–4 weeks.
          We prioritize quick wins that deliver immediate value, then build out
          more complex systems over time.
        </p>
      ),
    },
    {
      question: "Do I need to replace my current tools?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            No. We integrate with your existing stack and build automation on top
            of what you already use. Our job is to make your current tools work
            harder, not to add more to your plate.
          </p>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            And when an off-the-shelf solution doesn&apos;t exist, we build
            custom applications tailored to your exact workflow.
          </p>
        </>
      ),
    },
    {
      question: "What does it cost?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            Every engagement starts with a free{" "}
            <Link
              href={siteConfig.auditUrl}
              className="text-foreground underline"
            >
              Operations Audit
            </Link>
            . From there, pricing is project-based with no recurring fees — you
            pay for the system, not a subscription.
          </p>
        </>
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
