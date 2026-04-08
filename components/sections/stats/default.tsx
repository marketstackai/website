import { Section } from "../../ui/section";

interface StatItemProps {
  label?: string;
  value: string | number;
  suffix?: string;
  description?: string;
}

interface StatsProps {
  items?: StatItemProps[] | false;
}

export default function Stats({
  items = [
    {
      label: "Reclaim",
      value: "40",
      suffix: "hours",
      description: "per month by systemizing manual tasks and record keeping",
    },
    {
      label: "Recover",
      value: "12",
      suffix: "hours",
      description: "per week by automating handling routine customer questions and updates",
    },
    {
      label: "Eliminate",
      value: "90",
      suffix: "%",
      description: "of manual errors by replacing repetitive tasks with agentic workflows",
    },
    {
      label: "Scale",
      value: "2",
      suffix: "x",
      description: "to manage double the job capacity without adding office headcount",
    },
  ],
}: StatsProps) {
  return (
    <Section>
      <div className="container mx-auto max-w-[960px]">
        {items !== false && items.length > 0 && (
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-3 text-left"
              >
                {item.label && (
                  <div className="text-muted-foreground text-sm font-semibold">
                    {item.label}
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <div className="from-foreground to-foreground dark:to-brand bg-linear-to-r bg-clip-text text-4xl font-medium text-transparent drop-shadow-[2px_1px_24px_var(--brand-foreground)] transition-all duration-300 sm:text-5xl md:text-6xl">
                    {item.value}
                  </div>
                  {item.suffix && (
                    <div className="text-muted-foreground text-2xl font-semibold">
                      {item.suffix}
                    </div>
                  )}
                </div>
                {item.description && (
                  <div className="text-muted-foreground text-sm font-semibold text-pretty">
                    {item.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
