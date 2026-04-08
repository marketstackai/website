import { Section } from "../../ui/section";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { ArrowRightIcon, Search, Wrench, TrendingUp } from "lucide-react";
import Link from "next/link";
import Glow from "../../ui/glow";

export default function HowItWorks() {
  return (
    <Section className="py-20 relative">
      <div className="max-w-container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold sm:text-5xl mb-6">How it works</h2>
          <p className="text-muted-foreground text-lg text-balance max-w-2xl mx-auto">
            We don't just sell software. We diagnose your bottlenecks, build custom systems, and help you scale intelligently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-background relative overflow-hidden group border-brand/20">
            <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
              <div className="size-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-4">
                <Search className="size-6" />
              </div>
              <CardTitle className="text-xl">1. Diagnose</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Map your current lead flow, tech stack, and daily operations to find precisely where you're leaking revenue.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background relative overflow-hidden group border-brand/20">
            <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
               <div className="size-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-4">
                <Wrench className="size-6" />
              </div>
              <CardTitle className="text-xl">2. Build</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
               Deploy tailored AI agents and automated workflows designed specifically for the way your team actually works.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background relative overflow-hidden group border-brand/20">
            <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader>
               <div className="size-12 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-4">
                <TrendingUp className="size-6" />
              </div>
              <CardTitle className="text-xl">3. Scale</CardTitle>
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
