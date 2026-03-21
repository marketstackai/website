import Navbar from "@/components/sections/navbar/default";
import Hero from "@/components/sections/hero/default";
import FAQ from "@/components/sections/faq/default";
import CTA from "@/components/sections/cta/default";
import Footer from "@/components/sections/footer/default";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/spotlight-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Services",
  description:
    "Explore our packages, from DIY toolkits to fully deployed systems and strategic partnerships.",
};

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
          <CircleCheckBig className="h-5 w-5 shrink-0 text-brand" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <Navbar />

      <Hero
        title="Three ways to work with us. One goal: systems that capture every lead and close more jobs."
        description="Whether you need a DIY toolkit, a fully deployed system, or a strategic partner to re-engineer your operation — start anywhere, go as deep as you need."
        buttons={false}
        badge={false}
        mockup={false}
      />

      {/* Packages Section */}
      <Section className="py-12 sm:py-24">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <Card className="flex flex-col">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-4">DIY ENTRY</Badge>
                <CardTitle className="text-2xl">Market Stack Foundation Kit</CardTitle>
                <CardDescription>Building Blocks</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">$497 – $997</span>
                  <p className="text-sm text-muted-foreground mt-2">One-time. Instant access.</p>
                </div>
                <FeatureList
                  features={[
                    "Conversion website template",
                    "Email + SMS follow-up sequence templates",
                    "Google Business Profile optimization guide",
                    "Review generation playbook",
                    "Loom training library",
                    "DIY implementation — go at your own pace",
                  ]}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/checkout">Get the Kit</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2 (Flagship) */}
            <div className="relative md:-mt-4 md:-mb-4">
              <GlowCard customSize glowColor="brand" className="h-full border-brand/50">
                <div className="flex flex-col h-full z-10 relative">
                  <div className="p-6 pb-0 flex flex-col space-y-1.5 flex-1">
                    <Badge className="w-fit mb-4 bg-brand text-brand-foreground">FLAGSHIP — DONE FOR YOU</Badge>
                    <h3 className="text-2xl leading-none font-semibold tracking-tight">Market Stack Operating System</h3>
                    <p className="text-sm text-muted-foreground mt-2">Accelerated Deployment</p>
                    
                    <div className="my-6">
                      <span className="text-5xl font-bold">$4,500</span>
                      <p className="text-sm text-muted-foreground mt-2">PIF discount from $5,400. Or 3 × $1,800.</p>
                      <p className="text-sm text-muted-foreground mt-1">Then $297/4 weeks for ongoing optimization.</p>
                    </div>

                    <FeatureList
                      features={[
                        "Custom conversion website, built for you",
                        "Speed-to-lead: instant response to every inquiry",
                        "AI receptionist + missed-call text-back",
                        "60–90 day automated nurture sequences",
                        "Dormant lead reactivation campaign",
                        "Review automation + lead tracking dashboard",
                        "Live in 30 days. Optimized for 60 more.",
                      ]}
                    />

                    <div className="mt-6 bg-brand/10 border border-brand/20 p-4 rounded-lg">
                      <p className="text-sm font-medium text-brand-foreground">
                        90-Day Guarantee: 20 new warm conversations or we keep working until you get them.
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-6">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/book">Deploy My System</Link>
                    </Button>
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* Card 3 */}
            <Card className="flex flex-col">
              <CardHeader>
                <Badge variant="outline" className="w-fit mb-4">BESPOKE</Badge>
                <CardTitle className="text-2xl">Your Stack × Market Stack OS</CardTitle>
                <CardDescription>Strategic Partnership</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">Starting at $12,000</span>
                  <p className="text-sm text-muted-foreground mt-2">Scope determined after discovery. Includes ongoing advisory retainer.</p>
                </div>
                <FeatureList
                  features={[
                    "Full AI Operations Audit with ROI roadmap",
                    "Everything in the Market Stack OS",
                    "Custom workflow builds for your specific bottlenecks",
                    "Bespoke AI agent development",
                    "Integration with your existing tech stack",
                    "Ongoing advisory + quarterly roadmap refresh",
                  ]}
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/book">Book a Discovery Call</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Section>

      {/* Training & Enablement */}
      <Section className="py-12 bg-muted/30">
        <div className="max-w-[800px] mx-auto px-6">
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
                <Button variant="outline" asChild>
                  <Link href="/book">Book a Workshop</Link>
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
                <Button variant="outline" asChild>
                  <Link href="/book">Inquire</Link>
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
                <Button variant="outline" asChild>
                  <Link href="/book">Inquire</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Section>

      {/* Strategy & Discovery */}
      <Section className="py-12">
        <div className="max-w-[800px] mx-auto px-6">
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
              <CardFooter className="flex gap-4">
                <Button asChild>
                  <Link href="/audit">Take the Free Audit</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/book">Book a Stack Audit</Link>
                </Button>
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
                <Button variant="outline" asChild>
                  <Link href="/book">Book a Discovery Call</Link>
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
                <Button variant="outline" asChild>
                  <Link href="/book">Book a Discovery Call</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Section>

      {/* Implementation & Build (A La Carte) */}
      <Section className="py-12 bg-muted/30">
        <div className="max-w-[1000px] mx-auto px-6">
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
                    desc: "Conversational AI that answers calls, qualifies leads, and books appointments 24/7. Trained on your business.",
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
      </Section>

      {/* Ongoing Support & Retainers */}
      <Section className="py-12">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Ongoing Support & Retainers</h2>
            <p className="text-muted-foreground text-lg text-balance">
              Systems need care. Markets shift. New opportunities surface. Retainers keep your AI infrastructure current and performing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$297</span>
                  <span className="text-muted-foreground"> / 4 weeks</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitoring and optimization of live workflows. Bug fixes and integration updates. Monthly performance reporting. One workflow tweak per month.
                </p>
              </CardContent>
            </Card>

            <Card className="border-brand/50 bg-brand/5">
              <CardHeader>
                <CardTitle>Growth</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$997 – $1,500</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Everything in Maintenance + monthly advisory call, new workflow builds as priorities shift, team training as tools evolve, quarterly roadmap refresh.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advisory</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$500 – $800</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monthly strategy call. Quarterly AI briefing for your industry. Priority access for questions between calls. Tool and vendor recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
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
            question: "What industries do you work with?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">We specialize in high-ticket real estate service businesses: title companies, contractors (roofers, GCs, HVAC, plumbers, electricians), surveyors, and real estate attorneys. The systems we build are designed for businesses where every missed call or slow follow-up costs hundreds or thousands of dollars in lost revenue.</p>
          },
          {
            question: "How is this different from hiring a developer or buying software?",
            answer: <p className="text-muted-foreground text-sm mb-4 max-w-[640px] text-balance">A developer builds what you tell them. Software gives you features you may or may not need. We diagnose the problem first, design the right solution, and then build it. You&apos;re not paying for code or a license — you&apos;re paying for a system that produces a specific outcome: faster response times, more booked appointments, less manual work.</p>
          }
        ]}
      />

      <CTA 
        title="Every missed call is money walking out the door. Let's fix that." 
        buttons={[
          {
            href: "/audit",
            text: "Take the Free Stack Audit",
            variant: "outline"
          },
          {
            href: "/book",
            text: "Book a Discovery Call",
            variant: "default"
          }
        ]}
      />
      <Footer />
    </main>
  );
}
