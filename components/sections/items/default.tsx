import {
  BotIcon,
  PlugIcon,
  ActivityIcon,
  ScalingIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Item, ItemIcon, ItemTitle, ItemDescription } from "../../ui/item";
import { Section } from "../../ui/section";
import { ReactNode } from "react";

interface ItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface ItemsProps {
  title?: string;
  items?: ItemProps[] | false;
}

export default function Items({
  title = "Systems that work while you sleep",
  items = [
    {
      title: "Agentic Workflows",
      description:
        "AI agents that execute complex multi-step processes autonomously",
      icon: <BotIcon className="size-5 stroke-1" />,
    },
    {
      title: "Custom Integrations",
      description:
        "Connect your existing data and tools into one seamless, automated system",
      icon: <PlugIcon className="size-5 stroke-1" />,
    },
    {
      title: "Scalable Architecture",
      description:
        "Systems engineered to grow with your business",
      icon: <ScalingIcon className="size-5 stroke-1" />,
    },
    {
      title: "Real-Time Monitoring",
      description:
        "Live dashboards for every automated process — full visibility, zero surprises",
      icon: <ActivityIcon className="size-5 stroke-1" />,
    },
    {
      title: "Continuous Optimization",
      description:
        "Learns from your operations and improves processes over time",
      icon: <RefreshCwIcon className="size-5 stroke-1" />,
    },
  ],
}: ItemsProps) {
  return (
    <Section className="py-8 sm:py-16 md:py-20 px-1 sm:px-4">
      <div className="max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-20">
        <h2 className="max-w-4xl text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        {items !== false && items.length > 0 && (
          <div className="grid w-full auto-rows-fr grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
            {items.map((item, index) => (
              <Item key={index}>
                <ItemTitle className="flex items-center gap-2">
                  <ItemIcon>{item.icon}</ItemIcon>
                  {item.title}
                </ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
