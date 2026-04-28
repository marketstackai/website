"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CircleCheckBig, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BookingLink } from "./booking-link";
import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const pricingColumnVariants = cva(
  "max-w-container relative flex flex-col gap-6 overflow-hidden rounded-2xl p-8 shadow-xl",
  {
    variants: {
      variant: {
        default: "glass-1 to-transparent dark:glass-3 flex",
        glow: "glass-2 to-trasparent dark:glass-3 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] dark:after:bg-foreground/30 after:blur-[72px]",
        "glow-brand":
          "glass-3 from-card/100 to-card/100 dark:glass-4 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-brand-foreground/70 after:blur-[72px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface PricingColumnProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingColumnVariants> {
  name: string;
  icon?: ReactNode;
  description: string;
  price: number | string;
  priceSubtext?: ReactNode;
  priceNote: string;
  cta: {
    variant: "glow" | "default";
    label: string;
    href: string;
    interest?: string;
  };
  features: string[];
}

export function PricingColumn({
  name,
  icon,
  description,
  price,
  priceSubtext,
  priceNote,
  cta,
  features,
  variant,
  className,
  ...props
}: PricingColumnProps) {
  const hasNumericPrice = typeof price === 'number' || (typeof price === 'string' && /^\d/.test(price));

  return (
    <div
      className={cn(pricingColumnVariants({ variant, className }), "h-full")}
      {...props}
    >
      <hr
        className={cn(
          "via-foreground/10 absolute top-0 left-[10%] h-[1px] w-[80%] border-0 bg-linear-to-r from-transparent to-transparent",
          variant === "glow-brand" && "via-brand",
        )}
      />
      <div className="flex flex-col gap-7 h-full">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="text-brand flex items-center shrink-0 mt-1">
              {icon}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">
              {name}
            </h2>
            <p className="text-muted-foreground max-w-[220px] text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center">
          <div className="flex items-start gap-1">
            {hasNumericPrice && (
              <span className="text-muted-foreground text-2xl font-bold mt-1">$</span>
            )}
            <span className="text-6xl font-bold tracking-tight">{price}</span>
          </div>
          <div className="flex min-h-[40px] flex-col justify-center whitespace-nowrap">
            {priceSubtext !== undefined ? (
              priceSubtext
            ) : price !== 0 && price !== "0" && hasNumericPrice ? (
              <>
                <span className="text-sm font-medium">one-time payment</span>
                <span className="text-muted-foreground text-sm">
                  plus local taxes
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant={cta.variant} size="lg" asChild className="w-full group">
            {cta.interest ? (
              <BookingLink interest={cta.interest} className="flex items-center gap-1">
                {cta.label}
                <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </BookingLink>
            ) : (
              <Link href={cta.href} className="flex items-center gap-1">
                {cta.label}
                <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}
          </Button>
          <p className="text-muted-foreground max-w-[220px] text-sm">
            {priceNote}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CircleCheckBig className="text-brand size-4 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export { pricingColumnVariants };
