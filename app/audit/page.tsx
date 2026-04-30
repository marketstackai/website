"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import type { ContactFormData } from "@/components/forms/contact-form";
import { ArrowLeftIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeResults } from "@/lib/audit/engine";
import type { AuditResults, GHLAuditRecord } from "@/lib/audit/types";

const initialContactData: ContactFormData = {
  first_name: "", last_name: "", email: "", phone: "", company_name: "", website: "",
  sms_consent: false, marketing_consent: false,
};

const initialQuizData = {
  industry: "", industry_other: "", team_size: "", monthly_revenue: "",
  avg_job_value: "", monthly_leads: "",
  biggest_challenges: [] as string[], lead_response: "",
  ai_experience: "", ai_detail: "", urgency: "",
  additional_notes: ""
};

const QUIZ_START = 2;
const TOTAL_STEPS = 11;


export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null);
  const [contactData, setContactData] = useState<ContactFormData>(initialContactData);
  const [quizData, setQuizData] = useState(initialQuizData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ghlEnabled, setGhlEnabled] = useState(false);

  const formData = { ...contactData, ...quizData };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const stored = localStorage.getItem("ms_ghl_enabled");
      if (stored !== null) {
        setGhlEnabled(stored === "true");
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem("ms_audit_contact");
    if (saved) {
      try {
        const parsed: ContactFormData = JSON.parse(saved);
        setContactData(parsed);
      } catch { /* ignore */ }
      const savedStep = parseInt(sessionStorage.getItem("ms_audit_step") || "");
      const startStep = (savedStep >= QUIZ_START && savedStep <= TOTAL_STEPS) ? savedStep : QUIZ_START;
      setStep(startStep);
      // Tag the current entry with our step — spread existing state so Next.js routing isn't clobbered
      window.history.replaceState({ ...window.history.state, step: startStep }, "");
      sessionStorage.setItem("ms_audit_needs_reload", "1");
    } else {
      router.replace("/audit/start");
    }
  }, [router]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we popped history and there's a step in state, update UI to match
      if (e.state && e.state.step) {
        setStep(e.state.step);
        sessionStorage.setItem("ms_audit_step", String(e.state.step));
      }
      // If there is no step state, the browser has popped off the audit completely (e.g. to /audit/start).
      // We do nothing here and let Next.js naturally unmount this page and render the previous route.
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  const navigateToStep = (newStep: number) => {
    setStep(newStep);
    sessionStorage.setItem("ms_audit_step", String(newStep));
    window.history.pushState({ step: newStep }, "");
  };

  const nextStep = () => {
    if (step !== null && step < TOTAL_STEPS) navigateToStep(step + 1);
  };

  const prevStep = () => {
    if (step !== null && step >= QUIZ_START) {
      router.back();
    }
  };

  const results = useMemo<AuditResults | null>(() => {
    if (step !== 11 && step !== 11.5) return null;
    return computeResults(formData);
    // formData is recreated every render, so list its primitives as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, contactData, quizData]);

  const computedFields = results
    ? {
        estimated_leads_per_month: String(results.leads),
        leak_rate_pct: `${Math.round(results.leakRate * 100)}%`,
        avg_job_value_dollars: `$${results.jobValue.toLocaleString()}`,
        industry_multiplier: String(results.industryMultiplier),
        monthly_revenue_leak: `$${Math.round(results.maxImpactMonthly).toLocaleString()}`,
        annual_revenue_leak: `$${Math.round(results.maxImpactAnnual).toLocaleString()}`,
        total_score: String(results.totalScore),
        tier_label: results.tierLabel,
        tier_text: results.tierText,
        recommended_package: results.recommendedPackage,
        flag_hot_lead: results.hotLead ? "true" : "false",
        flag_high_ticket: results.highTicket ? "true" : "false",
        flag_quick_win: results.quickWinOpp ? "true" : "false",
        flag_enterprise_signal: results.enterpriseSignal ? "true" : "false",
        flag_nurture_track: results.nurtureTrack ? "true" : "false",
        quick_wins: results.quickWins.map(w => w.id).join(", "),
        recommendation: results.recommendedPackage,
      }
    : null;


  const submitToGHL = async (
    contact: ContactFormData,
    quiz: typeof quizData,
    computed: AuditResults,
  ): Promise<string | null> => {
    let sourceIndustry: string | null = null;
    let interest: string | null = null;
    try {
      sourceIndustry = sessionStorage.getItem("ms_industry");
      interest = sessionStorage.getItem("ms_interest");
    } catch { /* ignore */ }

    const tags: string[] = [];
    if (computed.hotLead) tags.push("hot");
    if (computed.highTicket) tags.push("high ticket");
    if (computed.enterpriseSignal) tags.push("enterprise");

    const recommendedMap: Record<string, GHLAuditRecord["recommended"]> = {
      "Foundation Kit": "foundation_kit",
      "Operating System": "operating_system",
      "Studio": "studio",
    };

    const auditRecord: GHLAuditRecord = {
      website: contact.website,
      industry: quiz.industry,
      industry_other: quiz.industry_other,
      team_size: quiz.team_size,
      monthly_revenue: quiz.monthly_revenue,
      avg_job_value: quiz.avg_job_value,
      monthly_leads: quiz.monthly_leads,
      biggest_challenges: quiz.biggest_challenges,
      lead_response: quiz.lead_response,
      ai_experience: quiz.ai_experience,
      ai_detail: quiz.ai_detail,
      urgency: quiz.urgency,
      additional_notes: quiz.additional_notes,
      recommended: recommendedMap[computed.recommendedPackage] ?? "foundation_kit",
    };

    try {
      const res = await fetch("/api/audit/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contact.email,
          full_name: `${contact.first_name} ${contact.last_name}`,
          company_name: contact.company_name,
          sms_consent: contact.sms_consent,
          marketing_consent: contact.marketing_consent,
          source_industry: sourceIndustry ?? undefined,
          interest: interest ?? undefined,
          contact_updates: {
            tags_add: tags,
            customField: { recommended: computed.recommendedPackage },
          },
          audit_record: auditRecord,
          computed_email: {
            firstName: contact.first_name,
            tierLabel: computed.tierLabel,
            totalScore: computed.totalScore,
            maxImpactMonthly: computed.maxImpactMonthly,
            maxImpactAnnual: computed.maxImpactAnnual,
            recommendedPackage: computed.recommendedPackage,
            aiReadinessScore: computed.aiReadiness.score,
            aiReadinessDescription: computed.aiReadiness.description,
            leads: computed.leads,
            leakRate: computed.leakRate,
            quickWins: computed.quickWins.slice(0, 1).map(w => ({
              title: w.title,
              recoveredMonthly: w.recoveredMonthly,
            })),
          },
        }),
      });
      const data = await res.json();
      return data.recordId ?? null;
    } catch (err) {
      console.error("GHL API submission failed:", err);
      return null;
    }
  };

  const handleAuditFormSubmit = (e: React.FormEvent) => {
    if (step !== 11) {
      // Form is rendered from step 2 onward so GHL tracker registers it early,
      // but we only want to actually submit on step 11.
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    void handleFinalSubmit(e);
  };

  const handleFinalSubmit = async (e: React.FormEvent, overrides?: { contact: ContactFormData; quiz: typeof quizData }) => {
    e.preventDefault();
    setIsSubmitting(true);

    const effectiveContact = overrides?.contact ?? contactData;
    const effectiveQuiz = overrides?.quiz ?? quizData;
    const effectiveForm = { ...effectiveContact, ...effectiveQuiz };

    const computed = computeResults(effectiveForm);

    setStep(11.5);

    const recordId = await submitToGHL(effectiveContact, effectiveQuiz, computed);
    const reportId = recordId ?? crypto.randomUUID();

    sessionStorage.setItem(
      `ms_audit_report_${reportId}`,
      JSON.stringify({ version: 2, results: computed, email: effectiveContact.email }),
    );
    sessionStorage.removeItem("ms_audit_step");
    sessionStorage.removeItem("ms_industry");

    router.replace(`/audit/report?id=${reportId}`);
  };


  const devAutofill = () => {
    const fills: Record<number, Partial<typeof quizData>> = {
      2: { industry: "other", industry_other: "Magician" },
      3: { team_size: "12" },
      4: { monthly_revenue: "175000" },
      5: { avg_job_value: "6000" },
      6: { monthly_leads: "50" },
      7: { biggest_challenges: ["missed_leads", "manual_tasks"] },
      8: { lead_response: "voicemail" },
      9: { ai_experience: "ai_some_results", ai_detail: "We use ChatGPT for marketing copy and have a basic 'thank you' email, but no automated qualification or scheduling." },
      10: { urgency: "urgent" },
      11: { additional_notes: "Main focus is reducing response time for after-hours leads and automating appointment setting to free up our office staff." }
    };
    if (step !== null && fills[step]) {
      setQuizData(prev => ({ ...prev, ...fills[step as number] }));
      if (step < 11) setTimeout(nextStep, 100);
    }
  };

  const devAutoSubmit = async () => {
    // Reuse the contact already captured on /audit/start (so the e2e test's tracker-created
    // contact in GHL is the one we look up). Fall back to a fresh test contact only when the
    // dev tool is invoked without going through the contact form first.
    const ts = Date.now();
    const rand = Math.floor(Math.random() * 10000);
    const hasSavedContact = contactData.email && contactData.email.length > 0;
    const fullContact: ContactFormData = hasSavedContact
      ? contactData
      : {
      first_name: "Test", last_name: "Test", email: `test+audit-${ts}-${rand}@marketstack.ai`, phone: "",
      company_name: "The Testing Company", website: "https://example.com", sms_consent: true, marketing_consent: true,
    };
    const fullQuiz: typeof quizData = {
      industry: "other", industry_other: "Magician", team_size: "12", monthly_revenue: "175000",
      avg_job_value: "6000", monthly_leads: "50",
      biggest_challenges: ["missed_leads", "manual_tasks"], lead_response: "voicemail",
      ai_experience: "ai_some_results", ai_detail: "Using ChatGPT for some basic tasks but looking for a more integrated lead management solution that connects to our CRM.",
      urgency: "urgent", additional_notes: "We need a way to handle high lead volume more efficiently without hiring more office staff. Interested in lead recovery and automated SMS follow-ups."
    };
    setContactData(fullContact);
    setQuizData(fullQuiz);
    sessionStorage.setItem("ms_audit_contact", JSON.stringify(fullContact));
    setStep(11);

    // Wait for step 11 to render so we can see the populated form before we submit it
    await new Promise(r => setTimeout(r, 80));
    handleFinalSubmit(new Event('submit') as unknown as React.FormEvent, { contact: fullContact, quiz: fullQuiz });
  };

  const renderOption = (value: string, label: string, field: keyof typeof quizData, autoNext = true) => {
    const isSelected = quizData[field] === value;
    return (
      <div key={value} onClick={() => { setQuizData({ ...quizData, [field]: value }); if (autoNext) setTimeout(nextStep, 350); }}
           className={cn("p-4 border border-border rounded-xl cursor-pointer hover:border-brand transition-all flex items-center justify-between", isSelected && "border-brand bg-brand/10 shadow-[0_0_20px_rgba(var(--brand-rgb),0.1)]")}>
        <span className="font-medium">{label}</span>
        <div className={cn("size-5 rounded-full border-2 flex items-center justify-center transition-colors", isSelected ? "border-brand" : "border-muted-foreground/30")}>
          {isSelected && <div className="size-2.5 rounded-full bg-brand animate-in fade-in zoom-in duration-300" />}
        </div>
      </div>
    );
  };

  const renderMultiselectOption = (value: string, label: string) => {
    const isSelected = quizData.biggest_challenges.includes(value);
    return (
      <div key={value} onClick={() => {
        const next = isSelected ? quizData.biggest_challenges.filter(v => v !== value) : [...quizData.biggest_challenges, value];
        setQuizData({ ...quizData, biggest_challenges: next });
      }} className={cn("p-4 border border-border rounded-xl cursor-pointer hover:border-brand transition-all flex items-center justify-between", isSelected && "border-brand bg-brand/10")}>
        <span className="font-medium text-left">{label}</span>
        <div className={cn("size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ml-4", isSelected ? "border-brand bg-brand" : "border-muted-foreground/30")}>
          {isSelected && <Check className="size-3.5 text-background" />}
        </div>
      </div>
    );
  };

  const progress = step !== null && step >= 1 && step <= 12 ? (step / TOTAL_STEPS) * 100 : 0;

  if (step === null) return null;

  return (
    <>
      {step === 11.5 && (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="size-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-xl font-medium">Running AI analysis...</p>
          </div>
        </div>
      )}

      {step >= 2 && step <= 11 && (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
          <div className="w-full h-1.5 bg-muted shrink-0 z-50 relative">
            <div className="h-full bg-brand transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <div className="absolute top-1.5 left-0 w-full p-2 sm:p-8 flex items-center justify-between z-50 pointer-events-none text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={prevStep} className="pointer-events-auto hover:text-foreground">
              <ArrowLeftIcon className="mr-2 size-4" /> Back
            </Button>
            <span className="text-sm font-medium pr-2 pt-1.5 sm:pt-0">Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div className="flex-1 flex flex-col items-center sm:justify-center pt-16 sm:pt-0 px-4 sm:px-6 animate-appear overflow-y-auto">
            <form name="audit" onSubmit={handleAuditFormSubmit} className="w-full max-w-lg mb-12 sm:mb-0">
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6 text-balance">What type of business do you operate?</h2>
                  {renderOption('home_services', 'Home Services (HVAC, Roofing, etc)', 'industry')}
                  {renderOption('real_estate', 'Real Estate (Brokerage, Investor, etc)', 'industry')}
                  {renderOption('professional_service', 'Professional Service (Attorney, CPA, etc)', 'industry')}
                  {renderOption('tech', 'Technology / Software', 'industry')}
                  {renderOption('ecom', 'E-Commerce', 'industry')}
                  {renderOption('other', 'Other (Please specify)', 'industry', false)}
                  {quizData.industry === 'other' && (
                    <input type="text" className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden focus:border-brand" placeholder="e.g. Solar Installation"
                           value={quizData.industry_other} onChange={e => setQuizData({...quizData, industry_other: e.target.value})} autoFocus />
                  )}
                  {quizData.industry === 'other' && <Button type="button" className="w-full mt-4" size="lg" onClick={nextStep}>Next</Button>}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-balance">How big is your team?</h2>
                    <p className="text-sm text-muted-foreground opacity-80 text-balance">Includes you, full-time staff, and long-term contractors.</p>
                  </div>
                  <div className="w-full bg-black border border-border rounded-2xl p-8 flex items-center justify-center transition-all hover:border-brand/40 focus-within:border-brand shadow-xl overflow-hidden">
                    <input 
                      type="number" 
                      className="bg-transparent border-none outline-hidden text-5xl font-bold text-white text-center tabular-nums focus:ring-0 w-full" 
                      placeholder="5"
                      value={quizData.team_size} 
                      onChange={e => setQuizData({...quizData, team_size: e.target.value})} 
                      autoFocus 
                    />
                  </div>
                  <Button type="button" className="w-full mt-6" size="lg" onClick={nextStep} disabled={!quizData.team_size || parseInt(quizData.team_size) < 1}>Next</Button>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-balance">What&apos;s your average monthly revenue?</h2>
                    <p className="text-sm text-muted-foreground opacity-80 text-balance">This helps us estimate your lead volume accurately.</p>
                  </div>
                  {quizData.monthly_revenue !== "undisclosed" ? (
                    <div className="flex flex-col items-stretch">
                      <div className="w-full bg-black border border-border rounded-2xl p-8 flex items-center justify-center shadow-lg transition-all focus-within:border-brand hover:border-brand/40 group overflow-hidden">
                        <div className="flex items-center">
                          <span className="text-4xl font-bold text-white pr-2 select-none">$</span>
                          <input
                            type="number"
                            className="bg-transparent border-none outline-hidden text-5xl font-bold text-white tabular-nums p-0 focus:ring-0 placeholder:text-white/20"
                            placeholder="175000"
                            style={{ width: `${Math.max(quizData.monthly_revenue?.length || 0, 6)}ch` }}
                            value={quizData.monthly_revenue}
                            onChange={e => setQuizData({ ...quizData, monthly_revenue: e.target.value })}
                            autoFocus
                            min={0}
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 text-center mt-4 uppercase tracking-[0.2em] font-bold">USD per month</p>
                    </div>
                  ) : (
                    <div className="p-8 border border-border rounded-xl text-center text-muted-foreground bg-muted/20">
                      <p className="text-lg font-medium text-foreground">Revenue not disclosed</p>
                      <p className="text-sm mt-1 mb-4">We&apos;ll estimate based on your team size.</p>
                      <button 
                        type="button"
                        onClick={() => setQuizData({ ...quizData, monthly_revenue: "" })}
                        className="text-xs font-semibold text-brand hover:underline underline-offset-4 cursor-pointer"
                      >
                        Enter revenue to help our estimates be more accurate.
                      </button>
                    </div>
                  )}
                  <div
                    onClick={() => setQuizData({ ...quizData, monthly_revenue: quizData.monthly_revenue === "undisclosed" ? "" : "undisclosed" })}
                    className={cn("p-4 border border-border rounded-xl cursor-pointer hover:border-brand transition-all flex items-center justify-between", quizData.monthly_revenue === "undisclosed" && "border-brand bg-brand/10 shadow-[0_0_20px_rgba(var(--brand-rgb),0.1)]")}
                  >
                    <span className="font-medium">Prefer not to say</span>
                    <div className={cn("size-5 rounded-full border-2 flex items-center justify-center transition-colors", quizData.monthly_revenue === "undisclosed" ? "border-brand" : "border-muted-foreground/30")}>
                      {quizData.monthly_revenue === "undisclosed" && <div className="size-2.5 rounded-full bg-brand animate-in fade-in zoom-in duration-300" />}
                    </div>
                  </div>
                  <Button type="button" className="w-full mt-4" size="lg" onClick={nextStep} disabled={!quizData.monthly_revenue || (quizData.monthly_revenue !== "undisclosed" && (parseFloat(quizData.monthly_revenue) || 0) < 1)}>Next</Button>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-balance">What is your average job value?</h2>
                    <p className="text-sm text-muted-foreground opacity-80 text-balance">What does a typical customer pay you per job or engagement?</p>
                  </div>
                  {quizData.avg_job_value !== "undisclosed" ? (
                    <div className="flex flex-col items-stretch">
                      <div className="w-full bg-black border border-border rounded-2xl p-8 flex items-center justify-center shadow-lg transition-all focus-within:border-brand hover:border-brand/40 group overflow-hidden">
                        <div className="flex items-center">
                          <span className="text-4xl font-bold text-white pr-2 select-none">$</span>
                          <input
                            type="number"
                            className="bg-transparent border-none outline-hidden text-5xl font-bold text-white tabular-nums p-0 focus:ring-0 placeholder:text-white/20"
                            placeholder="6000"
                            style={{ width: `${Math.max(quizData.avg_job_value?.length || 0, 4)}ch` }}
                            value={quizData.avg_job_value}
                            onChange={e => setQuizData({ ...quizData, avg_job_value: e.target.value })}
                            autoFocus
                            min={1}
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 text-center mt-4 uppercase tracking-[0.2em] font-bold">USD per job</p>
                    </div>
                  ) : (
                    <div className="p-8 border border-border rounded-xl text-center text-muted-foreground bg-muted/20">
                      <p className="text-lg font-medium text-foreground">Job value not disclosed</p>
                      <p className="text-sm mt-1 mb-4">We&apos;ll estimate based on your industry.</p>
                      <button 
                        type="button"
                        onClick={() => setQuizData({ ...quizData, avg_job_value: "" })}
                        className="text-xs font-semibold text-brand hover:underline underline-offset-4 cursor-pointer"
                      >
                        Enter job value to help our estimates be more accurate.
                      </button>
                    </div>
                  )}
                  <div
                    onClick={() => setQuizData({ ...quizData, avg_job_value: quizData.avg_job_value === "undisclosed" ? "" : "undisclosed" })}
                    className={cn("p-4 border border-border rounded-xl cursor-pointer hover:border-brand transition-all flex items-center justify-between", quizData.avg_job_value === "undisclosed" && "border-brand bg-brand/10 shadow-[0_0_20px_rgba(var(--brand-rgb),0.1)]")}
                  >
                    <span className="font-medium">Prefer not to say</span>
                    <div className={cn("size-5 rounded-full border-2 flex items-center justify-center transition-colors", quizData.avg_job_value === "undisclosed" ? "border-brand" : "border-muted-foreground/30")}>
                      {quizData.avg_job_value === "undisclosed" && <div className="size-2.5 rounded-full bg-brand animate-in fade-in zoom-in duration-300" />}
                    </div>
                  </div>
                  <Button type="button" className="w-full mt-6" size="lg" onClick={nextStep} disabled={!quizData.avg_job_value || (quizData.avg_job_value !== "undisclosed" && parseFloat(quizData.avg_job_value) < 1)}>Next</Button>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-balance">How many inbound leads do you get per month?</h2>
                    <p className="text-sm text-muted-foreground opacity-80 text-balance">Calls, form fills, messages — any new inquiry counts.</p>
                  </div>
                  {quizData.monthly_leads !== "not_sure" ? (
                    <div className="flex flex-col items-stretch">
                      <div className="w-full bg-black border border-border rounded-2xl p-8 flex items-center justify-center shadow-lg transition-all focus-within:border-brand hover:border-brand/40 group overflow-hidden">
                        <input
                          type="number"
                          className="bg-transparent border-none outline-hidden text-5xl font-bold text-white text-center tabular-nums p-0 focus:ring-0 placeholder:text-white/20 w-full"
                          placeholder="50"
                          value={quizData.monthly_leads}
                          onChange={e => setQuizData({ ...quizData, monthly_leads: e.target.value })}
                          autoFocus
                          min={0}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 text-center mt-4 uppercase tracking-[0.2em] font-bold">leads per month</p>
                    </div>
                  ) : (
                    <div className="p-8 border border-border rounded-xl text-center text-muted-foreground bg-muted/20">
                      <p className="text-lg font-medium text-foreground">Lead volume not provided</p>
                      <p className="text-sm mt-1 mb-4">We&apos;ll estimate based on your revenue and job value.</p>
                      <button
                        type="button"
                        onClick={() => setQuizData({ ...quizData, monthly_leads: "" })}
                        className="text-xs font-semibold text-brand hover:underline underline-offset-4 cursor-pointer"
                      >
                        Enter lead volume for more accurate results.
                      </button>
                    </div>
                  )}
                  <div
                    onClick={() => setQuizData({ ...quizData, monthly_leads: quizData.monthly_leads === "not_sure" ? "" : "not_sure" })}
                    className={cn("p-4 border border-border rounded-xl cursor-pointer hover:border-brand transition-all flex items-center justify-between", quizData.monthly_leads === "not_sure" && "border-brand bg-brand/10 shadow-[0_0_20px_rgba(var(--brand-rgb),0.1)]")}
                  >
                    <span className="font-medium">Not sure</span>
                    <div className={cn("size-5 rounded-full border-2 flex items-center justify-center transition-colors", quizData.monthly_leads === "not_sure" ? "border-brand" : "border-muted-foreground/30")}>
                      {quizData.monthly_leads === "not_sure" && <div className="size-2.5 rounded-full bg-brand animate-in fade-in zoom-in duration-300" />}
                    </div>
                  </div>
                  <Button type="button" className="w-full mt-4" size="lg" onClick={nextStep} disabled={!quizData.monthly_leads || (quizData.monthly_leads !== "not_sure" && (parseFloat(quizData.monthly_leads) || 0) < 1)}>Next</Button>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-4">
                  <div className="space-y-2 mb-6 text-balance">
                    <h2 className="text-2xl font-semibold">What challenges are you facing?</h2>
                    <p className="text-sm text-muted-foreground opacity-80">Select all that apply.</p>
                  </div>
                  {renderMultiselectOption('missed_leads', "Missing calls from leads and customers")}
                  {renderMultiselectOption('pipeline_stuck', "Inconsistent sales")}
                  {renderMultiselectOption('manual_tasks', "Doing too much manual work")}
                  {renderMultiselectOption('tool_disconnect', "Apps and tools lack integration")}
                  {renderMultiselectOption('unsure_ai', "Not sure how AI could actually help")}
                  <Button type="button" className="w-full mt-6" size="lg" onClick={nextStep} disabled={quizData.biggest_challenges.length === 0}>Next</Button>
                </div>
              )}
              {step === 8 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-6 text-balance">What happens when you can&apos;t answer the phone?</h2>
                  {renderOption('voicemail', "Voicemail", 'lead_response')}
                  {renderOption('office_pickup', "Third-party answering service", 'lead_response')}
                  {renderOption('auto_response', "Auto text-back", 'lead_response')}
                  {renderOption('ai_system', "AI receptionist", 'lead_response')}
                </div>
              )}
              {step === 9 && (
                <div className="space-y-6 text-balance">
                  <h2 className="text-2xl font-semibold mb-6">What is your AI Experience?</h2>
                  {renderOption('no_ai', "None", 'ai_experience', false)}
                  {renderOption('ai_poor_results', "Poor results so far", 'ai_experience')}
                  {renderOption('ai_some_results', "Some success, want more", 'ai_experience', false)}
                  {renderOption('ai_advanced', "Advanced user", 'ai_experience', false)}
                  {quizData.ai_experience === 'no_ai' && (
                    <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-medium text-muted-foreground pl-1">What&apos;s holding you back from trying AI?</label>
                      <textarea className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden min-h-[100px] focus:border-brand" placeholder="e.g. Not sure where to start, concerned about cost, don't trust the technology..."
                                  value={quizData.ai_detail} onChange={e => setQuizData({...quizData, ai_detail: e.target.value})} />
                    </div>
                  )}
                  {(quizData.ai_experience === 'ai_some_results' || quizData.ai_experience === 'ai_advanced') && (
                    <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-medium text-muted-foreground pl-1">Tell us more about your current setup</label>
                      <textarea className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden min-h-[100px] focus:border-brand" placeholder="e.g. Using ChatGPT for content, Zapier for lead alerts, or an AI chatbot on our site..."
                                  value={quizData.ai_detail} onChange={e => setQuizData({...quizData, ai_detail: e.target.value})} />
                    </div>
                  )}
                  {quizData.ai_experience && <Button type="button" className="w-full mt-4" size="lg" onClick={nextStep}>Next</Button>}
                </div>
              )}
              {step === 10 && (
                <div className="space-y-6 text-balance">
                  <h2 className="text-2xl font-semibold mb-6">How soon are you looking to implement new systems?</h2>
                  {renderOption('urgent', "Immediately", 'urgency')}
                  {renderOption('1_3_months', "1–3 months", 'urgency')}
                  {renderOption('3_6_months', "3–6 months", 'urgency')}
                  {renderOption('exploring', "Exploring", 'urgency')}
                </div>
              )}
              {step === 11 && (
                <div className="space-y-6 text-balance">
                  <h2 className="text-2xl font-semibold mb-6">Anything else?</h2>
                  <textarea name="additional_notes" className="w-full bg-background border rounded-lg px-4 py-2.5 min-h-[120px] focus:border-brand" placeholder="e.g. We're looking to scale to $200k/mo and are interested in AI lead qualification and automated appointment booking."
                            value={quizData.additional_notes} onChange={e => setQuizData({...quizData, additional_notes: e.target.value})} />

                  {/* Hidden Captures for debugging/manual checks, but ghl-capture-only hides them from the auto-tracker */}
                  <div className="ghl-capture-only" aria-hidden="true">
                    <label>Email</label>
                    <input type="email" readOnly name="email"              value={contactData.email}         className="ghl-capture-only" tabIndex={-1} />
                    
                    <label>Company Name</label>
                    <input type="text" readOnly name="company_name"         value={contactData.company_name} className="ghl-capture-only" tabIndex={-1} />

                    <label>Industry</label>
                    <input type="text" readOnly name="industry"            value={quizData.industry}            className="ghl-capture-only" tabIndex={-1} />
                    <label>Industry Other</label>
                    <input type="text" readOnly name="industry_other"      value={quizData.industry_other}      className="ghl-capture-only" tabIndex={-1} />
                    <label>Team Size</label>
                    <input type="text" readOnly name="team_size"           value={quizData.team_size}           className="ghl-capture-only" tabIndex={-1} />
                    <label>Monthly Revenue</label>
                    <input type="text" readOnly name="monthly_revenue"     value={quizData.monthly_revenue}     className="ghl-capture-only" tabIndex={-1} />
                    <label>Avg Job Value</label>
                    <input type="text" readOnly name="avg_job_value"       value={quizData.avg_job_value}       className="ghl-capture-only" tabIndex={-1} />
                    <label>Monthly Leads</label>
                    <input type="text" readOnly name="monthly_leads"       value={quizData.monthly_leads}       className="ghl-capture-only" tabIndex={-1} />
                    <label>Biggest Challenges</label>
                    <input type="text" readOnly name="biggest_challenges"  value={quizData.biggest_challenges.join(", ")} className="ghl-capture-only" tabIndex={-1} />
                    <label>Lead Response</label>
                    <input type="text" readOnly name="lead_response"       value={quizData.lead_response}       className="ghl-capture-only" tabIndex={-1} />
                    <label>AI Experience</label>
                    <input type="text" readOnly name="ai_experience"       value={quizData.ai_experience}       className="ghl-capture-only" tabIndex={-1} />
                    <label>AI Detail</label>
                    <input type="text" readOnly name="ai_detail"           value={quizData.ai_detail}           className="ghl-capture-only" tabIndex={-1} />
                    <label>Urgency</label>
                    <input type="text" readOnly name="urgency"             value={quizData.urgency}             className="ghl-capture-only" tabIndex={-1} />

                    {computedFields && Object.entries(computedFields).map(([k, v]) => {
                      const labelText = k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      return (
                        <React.Fragment key={k}>
                          <label className="ghl-capture-only">{labelText}</label>
                          <input type="text" readOnly name={k} value={v} className="ghl-capture-only" tabIndex={-1} />
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Calculating..." : "Get Results"}</Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {mounted && process.env.NODE_ENV === "development" && createPortal(
        <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const next = !ghlEnabled;
              localStorage.setItem("ms_ghl_enabled", String(next));
              setGhlEnabled(next);
              window.location.reload();
            }}
            className="opacity-80 hover:opacity-100 transition-all bg-background/80 backdrop-blur-md border-muted-foreground/20 shadow-xl flex items-center gap-2"
          >
            <input type="checkbox" checked={ghlEnabled} readOnly className="accent-brand pointer-events-none" />
            <span>GHL Tracking</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => { sessionStorage.clear(); window.location.reload(); }}
                  className="opacity-80 hover:opacity-100 transition-all bg-background/80 backdrop-blur-md border-muted-foreground/20 shadow-xl">
            Clear Session
          </Button>
          <Button variant="outline" size="sm" onClick={devAutofill}
                  className="opacity-80 hover:opacity-100 transition-all bg-background/80 backdrop-blur-md border-muted-foreground/20 shadow-xl">
            Auto Step
          </Button>
          <Button variant="outline" size="sm" onClick={devAutoSubmit}
                  className="opacity-80 hover:opacity-100 transition-all bg-background/80 backdrop-blur-md border-muted-foreground/20 shadow-xl">
            Auto Submit
          </Button>
        </div>,
        document.body
      )}
    </>
  );
}
