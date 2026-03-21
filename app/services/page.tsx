import Navbar from "@/components/sections/navbar/default";
import FAQ from "@/components/sections/faq/default";
import { siteConfig } from "@/config/site";
import CTA from "@/components/sections/cta/default";
import Footer from "@/components/sections/footer/default";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Blocks, Palette, ArrowUpRight } from "lucide-react";
import Link from "next/link";
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

export default function ServicesPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Navbar />
      
      {/* Packages Section */}
      <Section id="stack" className="pt-24 pb-12 sm:pt-32 sm:pb-24">
        <div className="max-w-container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="animate-appear mb-6">
              <span className="text-muted-foreground mr-2">
                Now Offering Free Operations Audits
              </span>
              <Link href={siteConfig.auditUrl} className="flex items-center gap-1 hover:text-brand transition-colors">
                Learn more
                <ArrowUpRight className="size-3" />
              </Link>
            </Badge>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold mb-6 animate-appear">Your Stack</h1>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-[640px] mx-auto text-balance animate-appear delay-100">
              Whether you need a DIY toolkit, a fully deployed system, or a strategic partner — start anywhere, go as deep as you need.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 relative z-10">
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
              cta={{ variant: "glow", label: "Get the Kit", href: "/checkout?ref=foundation" }}
              features={[
                "Conversion website template",
                "Email + SMS follow-up templates",
                "Google Business Profile optimization guide",
                "Review generation playbook",
                "Loom training library"
              ]}
              variant="default"
              className="w-full h-full"
            />
            
            <PricingColumn
              icon={<Zap className="size-10" />}
              name="Operating System"
              description="Accelerated deployment."
              price={"4,500"}
              priceSubtext={
                <>
                  <span className="text-sm">Implementation</span>
                  <span className="text-muted-foreground text-sm">Two weeks</span>
                </>
              }
              priceNote="Done For You with ongoing support options."
              cta={{ variant: "default", label: "Deploy My System", href: "/book?ref=os" }}
              features={[
                "Custom conversion website, built for you",
                "Speed-to-lead: instant response to every inquiry",
                "AI receptionist + missed-call text-back",
                "60–90 day automated nurture sequences",
                "Dormant lead reactivation campaign",
                "Review automation + lead tracking dashboard",
                "90-Day Guarantee: 20 new warm conversations"
              ]}
              variant="glow-brand"
              className="w-full h-full md:-translate-y-4"
            />

            <PricingColumn
              icon={<Palette className="size-10" />}
              name="Studio"
              description="Designed for you."
              price={"Custom"}
              priceNote="Strategic relationship to deliver your unique infrastructure."
              cta={{ variant: "glow", label: "Book a Discovery Call", href: "/book?ref=studio" }}
              features={[
                "Full AI Operations Audit with ROI roadmap",
                "Everything in the Market Stack OS",
                "Custom workflow builds for your specific bottlenecks",
                "Bespoke AI agent development",
                "Integration with your existing tech stack",
                "Ongoing advisory + quarterly roadmap refresh"
              ]}
              variant="default"
              className="w-full h-full"
            />
          </div>
          <Glow variant="bottom" className="opacity-60 scale-x-75 -translate-y-8" />
        </div>
      </Section>

      {/* Training & Enablement */}
      <Section id="train" className="py-12">
        <div className="max-w-[800px] mx-auto px-6 relative">
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
                      <Badge variant="secondary" className="mb-2">ENTRY</Badge>
                      <CardTitle>AI Starter Workshop</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$1,000 – $2,000</p>
                      <p className="text-sm text-muted-foreground">90 minutes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    90-minute hands-on session for your team. Covers practical AI applications they can start using in their daily roles immediately. No technical background required. Ideal for owners who want to build team buy-in before committing to a full system build.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <Link href="/book?ref=workshop" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">CORE</Badge>
                      <CardTitle>Role-Based AI Sprint</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$3,000 – $5,000</p>
                      <p className="text-sm text-muted-foreground">2–3 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    2–3 week engagement where we train specific roles on your team — office manager, dispatcher, estimator, project manager — on AI tools and workflows customized to their actual daily job. Each person walks away with workflows they built during the training.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <Link href="/book?ref=role-sprint" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">PREMIUM</Badge>
                      <CardTitle>AI Bootcamp</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$5,000 – $10,000</p>
                      <p className="text-sm text-muted-foreground">6–8 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    6–8 week comprehensive program. Covers tool selection, prompt engineering, workflow design, and building internal SOPs around AI. Your operations lead or office manager becomes the in-house AI person. For businesses that want to build internal AI capability, not just buy a system.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <Link href="/book?ref=bootcamp" className="flex items-center gap-1">
                      Inquire
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          <Glow variant="bottom" className="opacity-50 scale-x-75 -translate-y-8" />
        </div>
      </Section>

      {/* Strategize Section */}
      <Section id="strategize" className="py-12">
        <div className="max-w-[800px] mx-auto px-6 relative">
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
                      <Badge variant="secondary" className="mb-2">FREE / $500</Badge>
                      <CardTitle>Stack Audit</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">$0 / $500</p>
                      <p className="text-sm text-muted-foreground">60 minutes</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    60-minute paid diagnostic. We map your current lead flow, tech stack, and operational bottlenecks. You leave with a clear picture of where you&apos;re leaking revenue and what to fix first. The $500 fee credits toward any package purchase. A free self-assessment version is available at /audit.
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div className="flex gap-4">
                    <Button asChild className="group">
                      <Link href="/audit" className="flex items-center gap-1">
                        Get Your Free Audit
                        <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="group">
                      <Link href="/book?ref=stack-audit" className="flex items-center gap-1">
                        Book a Stack Audit
                        <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">CORE</Badge>
                      <CardTitle>AI Operations Audit</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">Starting at $5,000</p>
                      <p className="text-sm text-muted-foreground">2 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Deep 2-week engagement. Full workflow mapping across your entire operation, opportunity identification, and a prioritized implementation roadmap with real ROI projections. Includes one quick-win build so you see value immediately. This is the natural entry point for Strategic Partnership clients — the audit fee credits toward the full engagement.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <Link href="/book?ref=ops-audit" className="flex items-center gap-1">
                      Start Your Audit
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge variant="secondary" className="mb-2">PREMIUM</Badge>
                      <CardTitle>AI Growth Infrastructure Plan</CardTitle>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold whitespace-nowrap">Custom</p>
                      <p className="text-sm text-muted-foreground">4–6 weeks</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Full-scope strategy engagement. We map every revenue-touching workflow in your business, design the target operating model, and deliver a phased implementation plan with architecture, tooling recommendations, and ROI projections for each phase.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="group">
                    <Link href="/book?ref=growth-plan" className="flex items-center gap-1">
                      Start Your Audit
                      <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          <Glow variant="bottom" className="opacity-50 scale-x-75 -translate-y-8" />
        </div>
      </Section>

      {/* Build Section */}
      <Section id="build" className="py-12">
        <div className="max-w-[1000px] mx-auto px-6 relative">
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">Implementation & Build (À La Carte)</h2>
              <p className="text-muted-foreground text-lg text-balance">
                Working systems, not strategy decks. Individual builds available standalone or as add-ons to any package.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-card text-card-foreground shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground uppercase border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Service</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Price</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    {
                      name: "Reactivation Campaign",
                      desc: "One-time dormant lead blast + automated follow-up sequence build. Re-engage existing dead leads.",
                      price: "$1,500 – $2,500",
                      timeline: "1–2 weeks"
                    },
                    {
                      name: "Speed-to-Lead Build",
                      desc: "Automated instant response system for every new inquiry. Includes setup, copy, and lead source integration.",
                      price: "$2,000 – $3,000",
                      timeline: "1–2 weeks"
                    },
                    {
                      name: "AI Receptionist / Voice Agent",
                      desc: "Conversational AI that answers calls, qualifies leads, and books appointments 24/7. Trained on your business. Every missed call is money walking out the door. Let's fix that.",
                      price: "$2,500 – $4,000",
                      timeline: "2–3 weeks"
                    },
                    {
                      name: "Custom Workflow Build (single)",
                      desc: "One high-impact workflow, end-to-end. Estimate follow-up, job status notifications, vendor coordination, scheduling, etc.",
                      price: "$3,000 – $7,000",
                      timeline: "2–4 weeks"
                    },
                    {
                      name: "Website / Microsite Build",
                      desc: "AI-generated, conversion-focused website or landing page. Industry-optimized, deployed and ready.",
                      price: "$1,500 – $3,000",
                      timeline: "1–2 weeks"
                    },
                    {
                      name: "AI Front Office System",
                      desc: "Full AI-powered front office: voice agents, automated lead response, smart routing, follow-up, CRM integration.",
                      price: "$8,000 – $15,000",
                      timeline: "6–10 weeks"
                    },
                    {
                      name: "Custom AI Agent Build",
                      desc: "Purpose-built AI agents, internal tools, or complex multi-system integrations. Scope determined after discovery.",
                      price: "Custom",
                      timeline: "Varies"
                    }
                  ].map((item, i) => (
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
          </div>
          <Glow variant="bottom" className="opacity-50 scale-x-75 -translate-y-8" />
        </div>
      </Section>

      {/* Support Section */}
      <Section id="support" className="py-12">
        <div className="max-w-[1000px] mx-auto px-6 relative">
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
          <Glow variant="bottom" className="opacity-40 scale-x-75 -translate-y-8" />
        </div>
      </Section>

      {/* FAQ Overlay */}
      <FAQ 
        title="Frequently Asked Questions" 
        items={[
          {
            question: "How do I know this will actually pay for itself?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">Every engagement starts with diagnosis, not a pitch. Before we build anything, we identify the specific workflows where AI creates measurable impact: leads captured, response time reduced, revenue recovered. For the OS specifically, if your average job is worth $5,000 and the system books even 2 extra jobs per month, that&apos;s $10,000 in new revenue against a $4,500 investment. We don&apos;t move forward unless the math works — and we guarantee 20 warm conversations in 90 days.</p>
          },
          {
            question: "We already tried AI tools and they didn't stick. Why would this be different?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">Tools fail when they&apos;re layered on top of broken workflows. A chatbot doesn&apos;t fix a lead follow-up problem if nobody&apos;s looking at the leads. We start with your people and processes first, then build technology that fits how your team actually works. That&apos;s the difference between installing a tool and building a system.</p>
          },
          {
            question: "I'm not technical. Will I be able to use what you build?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">Yes. Everything we build is designed for the people who use it daily, not for engineers. If your team can use email and a calendar, they can use what we build. Training is included in every implementation engagement, and retainer clients get ongoing support as tools evolve.</p>
          },
          {
            question: "How fast before I see results?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">The Foundation Kit is instant access — implementation speed depends on you. The Market Stack OS launches in 30 days with a 60-day optimization window. Strategic Partnership timelines depend on scope but always start with quick wins during the audit phase. You&apos;ll see working output within the first week of any build engagement.</p>
          },
          {
            question: "What's the difference between the packages? How do I know which one I need?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">If you have no systems and need to start somewhere, the Foundation Kit gives you the templates and training to DIY. If you want it built, launched, and running for you, the OS is the move. If you have a complex operation with existing tools and need someone to diagnose and architect a custom solution, the Strategic Partnership is for you. Not sure? Take the free Stack Audit at /audit — it&apos;ll tell you exactly where you stand.</p>
          },
          {
            question: "Can I start small and upgrade later?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">Absolutely. Many clients start with a Stack Audit or the Foundation Kit, see the value, and upgrade to the OS. Foundation Kit buyers get their purchase price credited toward an OS upgrade. The path is designed to let you go at your own pace.</p>
          },
          {
            question: "How long does a typical implementation take?",
            answer: "Most Market Stack OS deployments are live in 30 days. Bespoke 'Studio' projects typically range from 8 to 12 weeks depending on complexity."
          },
          {
            question: "Do I need to hire an AI engineer to maintain this?",
            answer: "No. We build for reliability and user-friendliness. We also provide ongoing support retainers so you can focus on running your business while we ensure your systems evolve with the technology."
          },
          {
            question: "Can these systems integrate with my existing CRM?",
            answer: "Yes. We specialize in connecting modern AI workflows to the tools you already use, whether it's ServiceTitan, Housecall Pro, HubSpot, or custom proprietary software."
          }
        ]}
      />

      <CTA />
      <Footer />
    </main>
  );
}
