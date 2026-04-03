import { Section } from "../../ui/section";
import { Badge } from "../../ui/badge";
import { GlowCard } from "../../ui/spotlight-card";

interface FocusItem {
  title: string;
  description: string;
  pills: string[];
}

const focusItems: FocusItem[] = [
  {
    title: "Lead Generation",
    description: "Fill your pipeline with qualified prospects.",
    pills: ["SEO", "GEO", "Reputation Management"],
  },
  {
    title: "Sales Administration",
    description: "Infrastructure that turns leads into revenue.",
    pills: ["CRM", "Billing", "Nurture Sequences"],
  },
  {
    title: "Custom Solutions",
    description: "Systems tailored to your unique needs.",
    pills: ["Apps", "Agents", "Workflows"],
  },
];

export default function Focus() {
  return (
    <Section className="py-8 sm:py-12 md:py-16 px-4 sm:px-8">
      <div className="max-w-[1600px] mx-auto grid w-full grid-cols-1 min-[1360px]:grid-cols-3 gap-6 min-[1360px]:gap-10">
        {focusItems.map((item, index) => (
          <GlowCard key={index} glowColor="brand" customSize className="w-full rounded-3xl">
            {/* Dot grid overlay */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none opacity-[0.15]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="flex flex-col gap-4 p-4 sm:px-5 sm:py-4 h-full relative">
              <h3 className="text-2xl font-bold tracking-tight text-left">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed text-left">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-6">
                {item.pills.map((pill, pillIndex) => (
                  <Badge key={pillIndex} variant="secondary" className="px-3 py-1 text-[11px] uppercase tracking-wider font-bold bg-secondary/50 whitespace-nowrap">
                    {pill}
                  </Badge>
                ))}
              </div>
            </div>
          </GlowCard>
        ))}
      </div>
    </Section>
  );
}
