"use client";

import { Section } from "../../ui/section";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowRightIcon, Search, Wrench, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, PointerEvent } from "react";

const glowStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(250px circle at calc(var(--mx, -9999) * 1px) calc(var(--my, -9999) * 1px), color-mix(in oklch, var(--color-brand) 12%, transparent), transparent 60%)",
};

function onGlowMove(e: PointerEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", (e.clientX - rect.left).toFixed(2));
  e.currentTarget.style.setProperty("--my", (e.clientY - rect.top).toFixed(2));
}

function onGlowLeave(e: PointerEvent<HTMLDivElement>) {
  e.currentTarget.style.setProperty("--mx", "-9999");
  e.currentTarget.style.setProperty("--my", "-9999");
}

export default function HowItWorks() {
  return (
    <Section className="py-20 relative">
      <div className="max-w-container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold sm:text-5xl mb-6">How it works</h2>
          <p className="text-muted-foreground text-lg text-balance max-w-2xl mx-auto">
            We don&apos;t just sell software. We diagnose your bottlenecks, build custom systems, and help you scale intelligently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card
            className="relative overflow-hidden"
            style={glowStyle}
            onPointerMove={onGlowMove}
            onPointerLeave={onGlowLeave}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Search className="size-5 text-brand" />
                1. Diagnose
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Map your current lead flow, tech stack, and daily operations to find precisely where you&apos;re leaking revenue.
              </p>
            </CardContent>
          </Card>

          <Card
            className="relative overflow-hidden"
            style={glowStyle}
            onPointerMove={onGlowMove}
            onPointerLeave={onGlowLeave}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Wrench className="size-5 text-brand" />
                2. Build
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
               Deploy tailored AI agents and automated workflows designed specifically for the way your team actually works.
              </p>
            </CardContent>
          </Card>

          <Card
            className="relative overflow-hidden"
            style={glowStyle}
            onPointerMove={onGlowMove}
            onPointerLeave={onGlowLeave}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="size-5 text-brand" />
                3. Scale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Handle significantly more capacity and capture more revenue without adding headcount.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button size="lg" asChild className="group">
            <Link href="/services" className="flex items-center gap-2">
              Explore Our Services <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

    </Section>
  );
}
