"use client";
/* eslint-disable prefer-const */

import { useState } from "react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const scores: Record<string, Record<string, number>> = {
  team_size: { solo: 1, "2_10": 2, "11_50": 3, "51_200": 4, "200_plus": 4 },
  monthly_revenue: { under_50k: 1, "50k_100k": 2, "100k_250k": 3, "250k_500k": 4, "500k_plus": 5, undisclosed: 0 },
  biggest_challenge: { missed_leads: 2, pipeline_stuck: 3, manual_tasks: 4, no_visibility: 3, tool_disconnect: 4, unsure_ai: 1 },
  lead_response: { voicemail: 1, office_pickup: 2, auto_response: 3, ai_system: 4 },
  follow_up: { none: 1, manual: 2, partial: 3, full_auto: 4 },
  ai_experience: { no_ai: 1, ai_poor_results: 2, ai_some_results: 3, ai_advanced: 4 },
  urgency: { urgent: 4, "1_3_months": 3, "3_6_months": 2, exploring: 1 }
};

const avgJobValues: Record<string, number> = {
  under_500: 350, "500_2k": 1250, "2k_10k": 6000, "10k_plus": 15000
};

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    sms_consent: false, marketing_consent: false,
    industry: "", industry_other: "", team_size: "", monthly_revenue: "",
    biggest_challenge: "", lead_response: "", follow_up: "",
    ai_experience: "", ai_detail: "", urgency: "", avg_job_value: "",
    additional_notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    leads: number; leakRate: number; jobValue: number; monthlyLeak: number; annualLeak: number;
    totalScore: number; tierLabel: string; tierText: string; recommendedPackage: string;
    hotLead: boolean; highValue: boolean; quickWinOpp: boolean; enterpriseSignal: boolean;
    nurtureTrack: boolean; needsReview: boolean;
  } | null>(null);

  const totalSteps = 11;

  const nextStep = () => {
    if (step < 11) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSlide1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/audit/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.first_name,
          lastName: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          customField: {
            sms_consent: formData.sms_consent,
            marketing_consent: formData.marketing_consent,
            consent_timestamp: new Date().toISOString(),
            consent_source: "stack_audit_form"
          }
        })
      });
      // Errors handled gracefully without blocking UI
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      nextStep();
    }
  };

  const calculateResults = () => {
    // 1. Est monthly leads
    let leads = 0;
    if (formData.monthly_revenue && formData.monthly_revenue !== 'undisclosed') {
      const lookup: Record<string, number> = { under_50k: 10, "50k_100k": 25, "100k_250k": 50, "250k_500k": 80, "500k_plus": 120 };
      leads = lookup[formData.monthly_revenue] || 0;
    } else if (formData.team_size) {
      const lookup: Record<string, number> = { solo: 8, "2_10": 20, "11_50": 50, "51_200": 90, "200_plus": 130 };
      leads = lookup[formData.team_size] || 0;
    }

    // 2. Leak rate
    let q5q6score = (scores.lead_response[formData.lead_response] || 0) + (scores.follow_up[formData.follow_up] || 0);
    let leakRate = 0;
    if (q5q6score <= 3) leakRate = 0.6;
    else if (q5q6score <= 5) leakRate = 0.4;
    else if (q5q6score === 6) leakRate = 0.25;
    else leakRate = 0.1;

    // 3. Job Value
    let jobValue = avgJobValues[formData.avg_job_value] || 0;

    let monthlyLeak = leads * leakRate * jobValue;
    let annualLeak = monthlyLeak * 12;

    // Tiers
    let totalScore = 0;
    ["team_size", "monthly_revenue", "biggest_challenge", "lead_response", "follow_up", "ai_experience", "urgency"].forEach(key => {
      if (key === 'monthly_revenue' && formData[key as keyof typeof formData] === 'undisclosed') return;
      totalScore += (scores[key][formData[key as keyof typeof formData] as string] || 0);
    });

    let tierLabel = "Foundation";
    let tierText = "Foundation Stage";
    let recommendedPackage = "Market Stack Foundation Kit";
    let includesQ3 = formData.monthly_revenue && formData.monthly_revenue !== 'undisclosed';

    if (includesQ3) {
      if (totalScore >= 7 && totalScore <= 14) { tierLabel = "Foundation"; tierText = "Foundation Stage"; recommendedPackage = "Market Stack Foundation Kit"; }
      else if (totalScore >= 15 && totalScore <= 23) { tierLabel = "Growth"; tierText = "Growth Stage"; recommendedPackage = "Market Stack Operating System"; }
      else if (totalScore >= 24) { tierLabel = "Optimization"; tierText = "Optimization Stage"; recommendedPackage = "Your Stack × Market Stack OS"; }
    } else {
      if (totalScore >= 6 && totalScore <= 12) { tierLabel = "Foundation"; tierText = "Foundation Stage"; recommendedPackage = "Market Stack Foundation Kit"; }
      else if (totalScore >= 13 && totalScore <= 19) { tierLabel = "Growth"; tierText = "Growth Stage"; recommendedPackage = "Market Stack Operating System"; }
      else if (totalScore >= 20) { tierLabel = "Optimization"; tierText = "Optimization Stage"; recommendedPackage = "Your Stack × Market Stack OS"; }
    }

    let hotLead = formData.urgency === 'urgent' && totalScore >= 13;
    let highValue = formData.avg_job_value === '10k_plus' && (formData.monthly_revenue === '250k_500k' || formData.monthly_revenue === '500k_plus');
    let quickWinOpp = formData.biggest_challenge === 'missed_leads' && (scores.lead_response[formData.lead_response] || 0) <= 2;
    let enterpriseSignal = formData.ai_experience === 'ai_advanced' && ["51_200", "200_plus"].includes(formData.team_size);
    let nurtureTrack = formData.urgency === 'exploring';
    let needsReview = formData.industry === 'other' && !formData.industry_other;

    const resObj = {
      leads, leakRate, jobValue, monthlyLeak, annualLeak, 
      totalScore, tierLabel, tierText, recommendedPackage,
      hotLead, highValue, quickWinOpp, enterpriseSignal, nurtureTrack, needsReview
    };

    setResults(resObj);

    // Get cookie contact id
    const match = document.cookie.match(/ms_audit_cid=([^;]+)/);
    const existingContactId = match ? match[1] : null;

    if (existingContactId) {
      fetch("/api/audit/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: existingContactId,
          contact_updates: {
            tags_add: ["audit_completed", tierLabel.toLowerCase() + "_stage", ...(hotLead ? ["hot_lead"] : [])],
            tags_remove: ["audit_started"],
            customField: { audit_tier: tierLabel }
          },
          stack_audit_record: {
            industry: formData.industry,
            industry_other: formData.industry_other || null,
            team_size: formData.team_size,
            monthly_revenue: formData.monthly_revenue,
            biggest_challenge: formData.biggest_challenge,
            lead_response: formData.lead_response,
            follow_up: formData.follow_up,
            ai_experience: formData.ai_experience,
            ai_detail: formData.ai_detail || null,
            urgency: formData.urgency,
            avg_job_value: formData.avg_job_value,
            additional_notes: formData.additional_notes || null,
            audit_score: totalScore,
            audit_tier: tierLabel,
            monthly_revenue_leak: monthlyLeak,
            annual_revenue_leak: annualLeak,
            completed_at: new Date().toISOString(),
            ...resObj
          }
        })
      }).catch(console.error);
    }
    
    setStep(12); // Results
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStep(11.5); // Loading
    setTimeout(() => {
      calculateResults();
      setIsSubmitting(false);
    }, 2000);
  };

  const renderOption = (value: string, label: string, field: string) => {
    const isSelected = formData[field as keyof typeof formData] === value;
    return (
      <div
        key={value}
        onClick={() => {
          setFormData({ ...formData, [field]: value });
          setTimeout(nextStep, 350);
        }}
        className={cn(
          "p-4 border border-border rounded-xl cursor-pointer hover:border-brand transition-all flex items-center justify-between",
          isSelected && "border-brand bg-brand/10"
        )}
      >
        <span className="font-medium">{label}</span>
        <div className={cn("size-5 rounded-full border-2 flex items-center justify-center", isSelected ? "border-brand" : "border-muted-foreground/30")}>
          {isSelected && <div className="size-2.5 rounded-full bg-brand" />}
        </div>
      </div>
    );
  };

  if (step === 0) {
    return (
      <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
        <Section className="flex-1 flex flex-col items-center justify-center fade-bottom overflow-hidden pt-24 sm:pt-48">
          <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center px-4 relative z-10">
            <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl">
              Find out where you&apos;re leaking revenue — in under 5 minutes.
            </h1>
            <p className="text-md animate-appear text-muted-foreground max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl">
              Answer a few questions about your business and we&apos;ll show you exactly how much revenue your current systems are leaving on the table — and what to fix first.
            </p>
            <div className="animate-appear opacity-0 delay-300 mt-4">
              <Button size="lg" onClick={() => setStep(1)}>
                Start the Audit
                <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </div>
            <div className="mt-8">
              <Button variant="ghost" className="text-muted-foreground" asChild>
                <Link href="/"><ChevronLeftIcon className="mr-2" size={16}/> Back</Link>
              </Button>
            </div>
          </div>
        </Section>
      </main>
    );
  }

  if (step === 11.5) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-xl font-medium">Analyzing your stack...</p>
        </div>
      </div>
    );
  }

  if (step === 12 && results) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-24">
        <div className="max-w-4xl mx-auto px-6 pt-12 sm:pt-24 space-y-16">
          
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-semibold sm:text-5xl text-brand">Your estimated monthly revenue leak: ${results.monthlyLeak.toLocaleString()}</h1>
            <p className="text-xl text-muted-foreground">That&apos;s approximately <strong className="text-foreground">${results.annualLeak.toLocaleString()}</strong> per year your current systems are leaving on the table.</p>
            
            <div className="inline-flex flex-col items-start bg-muted/40 rounded-xl p-6 text-sm text-muted-foreground space-y-2 mt-4 max-w-sm mx-auto w-full">
              <div className="flex justify-between w-full"><span>Est. leads/mo:</span><span className="font-medium text-foreground">~{results.leads}</span></div>
              <div className="flex justify-between w-full"><span>Est. leak rate:</span><span className="font-medium text-foreground">{results.leakRate * 100}%</span></div>
              <div className="flex justify-between w-full"><span>Avg job value:</span><span className="font-medium text-foreground">${results.jobValue.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-center border-b pb-4">Your Stack Stage</h2>
            <div className="bg-card border rounded-2xl p-6 sm:p-10 text-lg space-y-4">
              <Badge className="mb-2 bg-foreground text-background">{results.tierText.toUpperCase()}</Badge>
              {results.tierLabel === 'Foundation' && <p>You&apos;re in the Foundation Stage. You have the hustle but not the systems yet. The good news: small changes to your lead capture and follow-up will have an outsized impact on your revenue. You don&apos;t need to overhaul everything — you need the right building blocks in place.</p>}
              {results.tierLabel === 'Growth' && <p>You&apos;re in the Growth Stage. You&apos;ve got volume and momentum, but your systems can&apos;t keep up. Leads are slipping through the cracks, follow-up is inconsistent, and your team is spending too much time on manual tasks. You need a system that runs without you babysitting it.</p>}
              {results.tierLabel === 'Optimization' && <p>You&apos;re in the Optimization Stage. You&apos;ve built real infrastructure, but you know there are still leaks and bottlenecks in your operation. The biggest gains for you come from custom AI workflows and strategic integration with your existing tools — not another off-the-shelf solution.</p>}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-center border-b pb-4">Recommended Service</h2>
            <div className="flex justify-center">
              <GlowCard customSize glowColor="brand" className="w-full max-w-md border-brand/50">
                <div className="flex flex-col h-full z-10 relative text-center">
                  <div className="p-6 flex-1 flex flex-col justify-center items-center">
                    <h3 className="text-2xl font-bold mb-4">{results.recommendedPackage}</h3>
                    <Button size="lg" className="w-full mt-4" asChild>
                      <Link href={results.tierLabel === 'Optimization' ? "/book" : results.tierLabel === 'Growth' ? "/book" : "/services"}>
                        {results.tierLabel === 'Optimization' ? "Book a Discovery Call" : results.tierLabel === 'Growth' ? "Deploy My System" : "Get the Kit"}
                      </Link>
                    </Button>
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-center border-b pb-4">Quick Wins</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.lead_response === 'voicemail' && (
                <Card><CardHeader><CardTitle className="text-xl">Set up a missed-call text-back.</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Even a simple auto-text saying &quot;Hey, we just missed your call&quot; recovers 20–40% of missed calls.</p></CardContent></Card>
              )}
              {formData.follow_up === 'none' && (
                <Card><CardHeader><CardTitle className="text-xl">Create a simple 3-touch follow-up sequence.</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Day 1, Day 3, Day 7 touches. Even this bare-bones sequence will recover jobs you&apos;re currently losing.</p></CardContent></Card>
              )}
              {formData.ai_experience === 'no_ai' && (
                <Card><CardHeader><CardTitle className="text-xl">Start with one AI tool for one task.</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Don&apos;t try to overhaul everything. Pick your biggest time sink and test one AI solution for 30 days.</p></CardContent></Card>
              )}
            </div>
          </div>

          <div className="pt-12 border-t text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-muted/30 p-8 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Want the full picture?</h4>
                  <p className="text-muted-foreground text-sm mb-6">Book a live Stack Audit ($500). We&apos;ll map your entire operation in 60 minutes — and the fee credits toward any package.</p>
                </div>
                <Button variant="outline" className="w-full" asChild><Link href="/book">Book My Stack Audit</Link></Button>
              </div>
              <div className="bg-muted/30 p-8 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Ready to fix it now?</h4>
                  <p className="text-muted-foreground text-sm mb-6">Let&apos;s talk about the right package for your business and start plugging the leaks.</p>
                </div>
                <Button className="w-full" asChild><Link href="/book">Book a Discovery Call</Link></Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-8">Your full audit report has also been sent to {formData.email}.</p>
          </div>
          
        </div>
      </div>
    );
  }

  // Quiz Layout (Steps 1-11)
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full h-1.5 bg-muted">
        <div className="h-full bg-brand transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="p-4 sm:p-8 shrink-0 flex items-center justify-between">
        {step > 1 ? (
          <Button variant="ghost" size="sm" onClick={prevStep} className="text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon className="mr-2 size-4" /> Back
          </Button>
        ) : <div />}
        <span className="text-sm font-medium text-muted-foreground">Step {step} of {totalSteps}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-appear">
        <div className="w-full max-w-lg">
          
          {step === 1 && (
            <form onSubmit={handleSlide1Submit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold mb-2">Let&apos;s start with you.</h2>
                <p className="text-muted-foreground">So we can send you your personalized audit report.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input required type="text" className="w-full bg-background border rounded-lg px-4 py-3 outline-hidden focus:border-brand" 
                         value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input required type="text" className="w-full bg-background border rounded-lg px-4 py-3 outline-hidden focus:border-brand"
                         value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Email</label>
                <input required type="email" className="w-full bg-background border rounded-lg px-4 py-3 outline-hidden focus:border-brand"
                       value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input type="tel" className="w-full bg-background border rounded-lg px-4 py-3 outline-hidden focus:border-brand"
                       placeholder="Optional" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                <p className="text-xs text-muted-foreground">Add your number to receive your results via text</p>
              </div>
              
              <div className="space-y-4 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 size-4 accent-brand border-muted-foreground" 
                         checked={formData.sms_consent} onChange={e => setFormData({...formData, sms_consent: e.target.checked})} />
                  <span className="text-xs text-muted-foreground leading-tight max-w-[400px]">
                    I consent to receive SMS notifications and alerts from Market Stack. Message frequency varies. Message & data rates may apply. Text HELP to [NUMBER] for assistance. Reply STOP to unsubscribe at any time.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 size-4 accent-brand border-muted-foreground"
                         checked={formData.marketing_consent} onChange={e => setFormData({...formData, marketing_consent: e.target.checked})} />
                  <span className="text-xs text-muted-foreground leading-tight">
                    I also agree to receive occasional marketing messages and offers from Market Stack.
                  </span>
                </label>
              </div>

              <div className="text-xs text-center text-muted-foreground/60">
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link> | <Link href="/terms" className="hover:underline">Terms of Service</Link>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Next"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">What type of business best describes you?</h2>
              {renderOption('contractor', 'Contractor / Home Services (HVAC, Roofing, GC, etc)', 'industry')}
              {renderOption('real_estate', 'Real Estate (Brokerage, Investment)', 'industry')}
              {renderOption('professional_service', 'Professional Service (Law, Accounting, Consulting)', 'industry')}
              {renderOption('other', 'Other (Please specify)', 'industry')}
              {formData.industry === 'other' && (
                <div className="space-y-2 mt-4 animate-appear">
                  <label className="text-sm text-muted-foreground">Please briefly describe your business:</label>
                  <input type="text" className="w-full bg-background border rounded-lg px-4 py-3 outline-hidden focus:border-brand"
                         value={formData.industry_other} onChange={e => setFormData({...formData, industry_other: e.target.value})} autoFocus />
                </div>
              )}
              {formData.industry && <Button className="w-full mt-4" onClick={nextStep} variant="secondary">Next</Button>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">How many full-time employees are on your team?</h2>
              {renderOption('solo', 'Just myself', 'team_size')}
              {renderOption('2_10', '2–10 employees', 'team_size')}
              {renderOption('11_50', '11–50 employees', 'team_size')}
              {renderOption('51_200', '51–200 employees', 'team_size')}
              {renderOption('200_plus', '200+ employees', 'team_size')}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">What&apos;s your average monthly revenue?</h2>
                <p className="text-muted-foreground mt-2">Optional — helps us give you a more accurate assessment.</p>
              </div>
              {renderOption('under_50k', 'Under $50K / month', 'monthly_revenue')}
              {renderOption('50k_100k', '$50K – $100K / month', 'monthly_revenue')}
              {renderOption('100k_250k', '$100K – $250K / month', 'monthly_revenue')}
              {renderOption('250k_500k', '$250K – $500K / month', 'monthly_revenue')}
              {renderOption('500k_plus', '$500K – $1M+ / month', 'monthly_revenue')}
              {renderOption('undisclosed', 'Prefer not to say', 'monthly_revenue')}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">What&apos;s the single biggest challenge impacting your revenue right now?</h2>
              {renderOption('missed_leads', "We're missing calls or leads, or our follow-up is too slow", 'biggest_challenge')}
              {renderOption('pipeline_stuck', "Our sales pipeline is inconsistent, or deals get stuck", 'biggest_challenge')}
              {renderOption('manual_tasks', "Our team spends too much time on manual, repetitive tasks", 'biggest_challenge')}
              {renderOption('no_visibility', "We lack clear visibility into our sales or marketing performance", 'biggest_challenge')}
              {renderOption('tool_disconnect', "Our existing software tools don't communicate effectively", 'biggest_challenge')}
              {renderOption('unsure_ai', "We're not sure how AI could specifically help our business", 'biggest_challenge')}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">What happens when you miss a call or a new lead comes in outside business hours?</h2>
              {renderOption('voicemail', "It goes to voicemail and we call back when we can", 'lead_response')}
              {renderOption('office_pickup', "An office person or answering service picks up most of the time", 'lead_response')}
              {renderOption('auto_response', "We have an automated text-back or email response", 'lead_response')}
              {renderOption('ai_system', "We have an AI receptionist or instant response system", 'lead_response')}
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Do you have automated follow-up sequences for leads that don&apos;t convert immediately?</h2>
              {renderOption('none', "No — if they don't book, we move on", 'follow_up')}
              {renderOption('manual', "We follow up manually a couple of times", 'follow_up')}
              {renderOption('partial', "We have some automated emails but nothing comprehensive", 'follow_up')}
              {renderOption('full_auto', "Yes — full automated nurture sequences running", 'follow_up')}
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Have you explored or implemented AI tools in your business yet?</h2>
              {renderOption('no_ai', "No, we haven't started", 'ai_experience')}
              {renderOption('ai_poor_results', "Yes, but we're not seeing the results we hoped for", 'ai_experience')}
              {renderOption('ai_some_results', "Yes, seeing some positive impact but want to do more", 'ai_experience')}
              {renderOption('ai_advanced', "Yes, actively using AI in multiple core workflows", 'ai_experience')}
              
              {(formData.ai_experience === 'ai_some_results' || formData.ai_experience === 'ai_advanced') && (
                <div className="space-y-2 mt-4 animate-appear">
                  <label className="text-sm text-muted-foreground">How are you currently using AI, or what workflows are you optimizing?</label>
                  <textarea className="w-full bg-background border rounded-lg px-4 py-3 outline-hidden focus:border-brand min-h-[100px] resize-none"
                            value={formData.ai_detail} onChange={e => setFormData({...formData, ai_detail: e.target.value})} />
                </div>
              )}
              {formData.ai_experience && <Button className="w-full mt-4" onClick={nextStep} variant="secondary">Next</Button>}
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">How quickly are you looking to implement a solution and see results?</h2>
              {renderOption('urgent', "Immediately / This is urgent", 'urgency')}
              {renderOption('1_3_months', "Within the next 1–3 months", 'urgency')}
              {renderOption('3_6_months', "Within the next 3–6 months", 'urgency')}
              {renderOption('exploring', "Just exploring options for the future", 'urgency')}
            </div>
          )}

          {step === 10 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">What&apos;s your average job value or average revenue per client?</h2>
              {renderOption('under_500', "Under $500", 'avg_job_value')}
              {renderOption('500_2k', "$500 – $2,000", 'avg_job_value')}
              {renderOption('2k_10k', "$2,000 – $10,000", 'avg_job_value')}
              {renderOption('10k_plus', "$10,000+", 'avg_job_value')}
            </div>
          )}

          {step === 11 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Anything else you&apos;d like us to know about your current situation or goals?</h2>
              <textarea 
                className="w-full bg-background border rounded-lg px-4 py-3 outline-hidden focus:border-brand min-h-[120px] resize-none"
                placeholder="Optional..."
                value={formData.additional_notes}
                onChange={e => setFormData({...formData, additional_notes: e.target.value})}
              />
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Calculating..." : "Show My Results"}
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
