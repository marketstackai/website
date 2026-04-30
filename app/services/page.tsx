import Navbar from "@/components/sections/navbar/default";
import FAQ from "@/components/sections/faq/default";
import { siteConfig } from "@/config/site";
import CTA from "@/components/sections/cta/default";
import Footer from "@/components/sections/footer/default";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ArrowUpRight, Palette } from "lucide-react";
import Link from "next/link";
import { BookingLink } from "@/components/ui/booking-link";
import { PricingColumn } from "@/components/ui/pricing-column";
import Glow from "@/components/ui/glow";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Services",
  description:
    "Explore our packages, from DIY toolkits to fully deployed systems and strategic partnerships.",
};

const BUILDS = [
  {
    name: "Reactivation",
    desc: "Dormant lead blast + automated follow-up sequence build. Re-engage existing dead leads.",
    price: "$1,000+",
    timeline: "1–2 weeks",
  },
  {
    name: "Speed-to-Lead",
    desc: "Automated instant response system for every new inquiry. Includes setup, copy, and lead source integration.",
    price: "$2,000+",
    timeline: "1–2 weeks",
  },
  {
    name: "Website",
    desc: "AI-generated, conversion-focused website or landing page. Industry-optimized, deployed and ready.",
    price: "$2,000+",
    timeline: "1–2 weeks",
  },
  {
    name: "Custom Workflow",
    desc: "One high-impact workflow, end-to-end. Estimate follow-up, job status notifications, vendor coordination, scheduling, etc.",
    price: "$2,000+",
    timeline: "2–4 weeks",
  },
  {
    name: "AI Receptionist",
    desc: "Conversational AI that answers calls, qualifies leads, and books appointments 24/7. Trained on your business.",
    price: "$4,000+",
    timeline: "2–3 weeks",
  },
  {
    name: "AI Agent",
    desc: "Purpose-built AI agents, internal tools, or complex multi-system integrations. Scope determined after discovery.",
    price: "Custom",
    timeline: "Varies",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Navbar />
      
      {/* Packages Section */}
      <Section id="stack" className="pt-12 pb-12 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="max-w-container mx-auto px-0 sm:px-6 relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="animate-appear mb-6">
              <span className="text-muted-foreground mr-2">
                Now Offering Free AI Audits
              </span>
              <Link href={siteConfig.auditUrl} className="flex items-center gap-1 hover:text-brand transition-colors">
                Start
                <ArrowUpRight className="size-3" />
              </Link>
            </Badge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold mb-6 animate-appear">The Stack</h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-[640px] mx-auto text-balance animate-appear delay-100">
              Whether you need a DIY toolkit, a fully deployed system, or a strategic partner — start anywhere, go as deep as you need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto w-full relative z-10">
            {/* Foundation Kit — hidden until ready
            <PricingColumn
              icon={<Blocks className="size-10" />}
              name="Foundation Kit"
              description="Building blocks."
              price={"497"}
              priceSubtext={
                <>
                  <span className="text-sm">One-time payment</span>
                  <span className="text-muted-foreground text-sm">Instant access</span>
                </>
              }
              priceNote="DIY implementation — go at your own pace."
              cta={{ variant: "glow", label: "Get the Kit", href: "/book", interest: "kit" }}
              features={[
                "Standard website template",
                "Email + SMS follow-up blueprint",
                "Google Business Profile optimization guide",
                "Review generation playbook",
                "Training library"
              ]}
              variant="default"
              className="w-full h-full"
            />
            */}

            <PricingColumn
              icon={<Zap className="size-10" />}
              name="Operating System"
              description="Accelerated deployment."
              price={"497"}
              priceSubtext={
                <>
                  <span className="text-sm">/ month</span>
                  <span className="text-muted-foreground text-sm">$4970 setup</span>
                </>
              }
              priceNote="Done for you with ongoing support options."
              cta={{ variant: "default", label: "Deploy the System", href: "/book", interest: "os" }}
              features={[
                "Custom website",
                "Instant response to every inquiry",
                "Automated nurture sequences",
                "Lead reactivation campaigns",
                "Review automation",
                "Lead tracking dashboard",
              ]}
              variant="glow-brand"
              className="w-full h-full"
            />

            <PricingColumn
              icon={<Palette className="size-10" />}
              name="Studio"
              description="Designed for you."
              price={"Custom"}
              priceNote="Strategic relationship to deliver your unique infrastructure."
              cta={{ variant: "glow", label: "Book a Discovery Call", href: "/book", interest: "studio" }}
              features={[
                "Complete operations audit",
                "Custom workflows",
                "AI agent development",
                "Ongoing advisory + roadmap refresh"
              ]}
              variant="default"
              className="w-full h-full"
            />
          </div>
          <Glow variant="bottom" className="opacity-60 scale-x-75 -translate-y-24" />
        </div>
      </Section>

      {/* Training & Enablement */}
      <Section id="train" className="py-12 overflow-hidden">
        <div className="max-w-[800px] mx-auto px-0 sm:px-6 relative">
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Training & Enablement</h2>
              <p className="text-muted-foreground text-lg text-balance">
                Teach your team to work alongside AI. Builds buy-in before a system build and improves adoption after one.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>AI Starter Workshop</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$1,000+</p>
                      <p className="text-sm text-muted-foreground">90 minutes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base font-semibold">Hands-on session to build team buy-in before committing to a full system build.</p>
                  <ul className="text-muted-foreground text-base mt-2 space-y-1 list-disc pl-4">
                    <li>Practical AI applications your team can use in daily roles immediately</li>
                    <li>No technical background required</li>
                    <li>90 minutes, in-person or virtual</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <BookingLink interest="workshop" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </BookingLink>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>Role-Based AI Sprint</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$3,000+</p>
                      <p className="text-sm text-muted-foreground">2–3 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base font-semibold">Train specific roles on AI tools and workflows customized to their actual daily job.</p>
                  <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc pl-4">
                    <li>Covers office managers, dispatchers, estimators, project managers</li>
                    <li>Each person walks away with workflows they built during training</li>
                    <li>2&#8211;3 week engagement</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <BookingLink interest="rolesprint" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </BookingLink>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>AI Bootcamp</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$5,000+</p>
                      <p className="text-sm text-muted-foreground">6–8 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base font-semibold">Build internal AI capability — your ops lead becomes the in-house AI person.</p>
                  <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc pl-4">
                    <li>Tool selection, prompt engineering, workflow design, and internal SOPs</li>
                    <li>6&#8211;8 week comprehensive program</li>
                    <li>For businesses that want to own the capability, not just buy a system</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <BookingLink interest="bootcamp" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </BookingLink>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          <Glow variant="bottom" className="opacity-50 scale-x-75 translate-y-72" />
        </div>
      </Section>

      {/* Strategize Section */}
      <Section id="strategize" className="py-12 overflow-hidden">
        <div className="max-w-[800px] mx-auto px-0 sm:px-6 relative">
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Strategy & Discovery</h2>
              <p className="text-muted-foreground text-lg text-balance">
                Diagnose before you build. We map your operation and find the highest-leverage systems to build first.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>Stack Audit</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$500+</p>
                      <p className="text-sm text-muted-foreground">60 minutes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base font-semibold">Map your lead flow, tech stack, and bottlenecks in one session.</p>
                  <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc pl-4">
                    <li>Clear picture of where you&apos;re leaking revenue and what to fix first</li>
                    <li>$500 fee credits toward any package purchase</li>
                    <li>Free self-assessment version available at /audit</li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="flex gap-4">
                    <Button variant="default" asChild className="group">
                      <Link href="/audit" className="flex items-center gap-1">
                        Free Audit
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="group">
                      <BookingLink interest="stackaudit" className="flex items-center gap-1">
                        Book Audit Call
                        <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </BookingLink>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>AI Operations Audit</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">Starting at $5,000</p>
                      <p className="text-sm text-muted-foreground">2 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base font-semibold">Full workflow mapping with a prioritized implementation roadmap and real ROI projections.</p>
                  <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc pl-4">
                    <li>Covers your entire operation over a deep 2-week engagement</li>
                    <li>Includes one quick-win build so you see value immediately</li>
                    <li>Natural entry point for Studio clients — audit fee credits toward the full engagement</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <BookingLink interest="opsaudit" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </BookingLink>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle>AI Growth Infrastructure Plan</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">Custom</p>
                      <p className="text-sm text-muted-foreground">4–6 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base font-semibold">Design your target operating model with a phased implementation plan.</p>
                  <ul className="text-muted-foreground text-sm mt-2 space-y-1 list-disc pl-4">
                    <li>Map every revenue-touching workflow in your business</li>
                    <li>Architecture and tooling recommendations per phase</li>
                    <li>ROI projections for each phase of implementation</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <BookingLink interest="growthplan" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </BookingLink>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          <Glow variant="bottom" className="opacity-50 scale-x-75 translate-y-72" />
        </div>
      </Section>

      {/* Build Section */}
      <Section id="build" className="py-12 overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-0 sm:px-6 relative">
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Customized Builds</h2>
              <p className="text-muted-foreground text-lg text-balance">
                Working systems, not strategy decks. Individual builds available standalone or as add-ons to any package.
              </p>
            </div>

            <>
                  {/* Mobile: stacked cards */}
                  <div className="flex flex-col gap-4 md:hidden">
                    {BUILDS.map((item, i) => (
                      <div key={i} className="rounded-xl border bg-card p-5">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <p className="font-medium">{item.name}</p>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-base">{item.price}</p>
                            <p className="text-sm text-muted-foreground">{item.timeline}</p>
                          </div>
                        </div>
                        <p className="text-base text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden md:block overflow-x-auto rounded-xl border bg-card text-card-foreground shadow-sm">
                    <table className="w-full text-base text-left">
                      <thead className="bg-muted text-muted-foreground uppercase border-b">
                        <tr>
                          <th className="px-6 py-4 font-medium">Service</th>
                          <th className="px-6 py-4 font-medium">Description</th>
                          <th className="px-6 py-4 font-medium whitespace-nowrap">Price</th>
                          <th className="px-6 py-4 font-medium whitespace-nowrap">Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {BUILDS.map((item, i) => (
                          <tr key={i} className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 font-medium">{item.name}</td>
                            <td className="px-6 py-4 text-muted-foreground">{item.desc}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.timeline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
          </div>
          <Glow variant="bottom" className="opacity-50 scale-x-[0.6] translate-y-72" />
        </div>
      </Section>

      {/* Support Section */}
      <Section id="support" className="py-12 overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-0 sm:px-6 relative">
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Ongoing Support & Retainers</h2>
              <p className="text-muted-foreground text-lg text-balance">
                Systems need care. Markets shift. New opportunities surface. Keep your AI infrastructure current and performing.
              </p>
            </div>

            <Card className="max-w-[600px] mx-auto text-center p-8 bg-linear-to-b from-brand/10 to-transparent border-brand/20">
              <CardHeader>
                <CardTitle className="text-2xl">Ongoing Advisory & Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-8">
                  Every business scales differently. We provide custom maintenance and advisory retainers tailored to your specific infrastructure, ensuring your systems evolve with your growth.
                </p>
                <Button size="lg" asChild className="w-full sm:w-auto px-12">
                  <Link href="/book">Book a Discovery Session</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Spoke Cross-Links */}
      <Section id="solutions" className="py-12 overflow-hidden">
        <div className="max-w-[1000px] mx-auto px-0 sm:px-6 relative">
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Explore by Solution</h2>
              <p className="text-muted-foreground text-lg text-balance">
                Each capability below has its own deep-dive page — outcomes, how it works, and the math behind the ROI.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "AI Receptionist", href: "/services/ai-receptionist", description: "24/7 call handling and booking" },
                { label: "Converational AI", href: "/services/ai-conversational", description: "Engage leads across every channel" },
                { label: "Lead Reactivation", href: "/services/lead-reactivation", description: "Revenue from dormant contacts" },
                { label: "Reviews", href: "/services/reviews", description: "Build your reputation on autopilot" },
                { label: "Quotes", href: "/services/quotes", description: "Close more estimates you send" },
                { label: "Booking Recovery", href: "/services/booking-recovery", description: "Reduce no-shows and cancels" },
                { label: "Agentic Workflows", href: "/services/agentic-workflows", description: "Custom multi-system automation" },
                { label: "SEO", href: "/services/seo", description: "Rank where customers search" },
                { label: "GEO", href: "/services/geo", description: "Optimize for AI-powered search" },
                { label: "Websites", href: "/services/websites", description: "Fast, conversion-focused sites" },
                { label: "Document Processing", href: "/services/document-processing", description: "AI extraction and routing" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col gap-1 rounded-xl border bg-card p-5 hover:bg-accent transition-colors"
                >
                  <p className="font-medium group-hover:text-foreground transition-colors">{item.label}</p>
                  <p className="text-base text-muted-foreground">{item.description}</p>
                </Link>
              ))}
              <BookingLink
                interest="studio"
                className="group relative flex flex-col gap-1 rounded-xl border border-brand/40 bg-white/[0.03] backdrop-blur-sm overflow-hidden p-5 cursor-pointer transition-colors hover:border-brand/60"
              >
                <div className="pointer-events-none absolute -top-8 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full bg-brand-foreground/60 blur-2xl" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/[0.04] via-brand/10 to-transparent" />
                <p className="relative font-medium group-hover:text-foreground transition-colors">Custom Build</p>
                <p className="relative text-base text-muted-foreground">Studio-tier engagements for unique infrastructure</p>
              </BookingLink>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Overlay */}
      <FAQ title="Frequently Asked Questions" />

      <CTA />
      <Footer />
    </main>
  );
}
