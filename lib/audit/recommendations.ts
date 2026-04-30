import { getRecommendedStack, RECOMMENDED_STACKS, type RecommendedStackDisplay, type RecommendedStackLabel } from "./display";
import type { QuizData, QuickWin } from "./types";

const RECOVERY_RATE = 0.50;
const MIN_MONTHLY_ROI = 100;

export interface DebugQuickWin extends QuickWin {
  triggerMet: boolean;
  meetsRoiThreshold: boolean;
  inTopThree: boolean;
  triggerDescription: string;
}

export interface MetricContext {
  leads: number;
  leakRate: number;
  jobValue: number;
}

function buildRoiString(
  leads: number,
  leakRate: number,
  jobValue: number,
  recoveredLeads: number,
  recoveredMonthly: number,
): string {
  const leaked = Math.round(leads * leakRate);
  return `Based on your ~${leads} leads/mo and ${Math.round(leakRate * 100)}% leak rate, this could recover ~${recoveredLeads} of ${leaked} leaked leads/mo. At $${jobValue.toLocaleString()} avg job value, that's ~$${Math.round(recoveredMonthly).toLocaleString()}/mo in recovered revenue.`;
}

function buildPrimaryStackWin(
  stack: RecommendedStackDisplay,
  leakedLeads: number,
  jobValue: number,
): QuickWin {
  const recoveredLeads = Math.round(leakedLeads * stack.recoveryRate);
  const recoveredMonthly = recoveredLeads * jobValue;

  return {
    id: stack.id,
    title: stack.title,
    description: stack.description,
    service: stack.service,
    priceRange: stack.priceRange,
    timeline: stack.timeline,
    recoveredLeads,
    recoveredMonthly,
    recoveredAnnual: recoveredMonthly * 12,
    roiProjection: stack.roiProjection,
    ctaLabel: stack.ctaLabel,
    ctaHref: stack.ctaHref,
    interest: stack.interest,
    priority: -1,
    isPrimary: true,
  };
}

export function getQuickWins(data: QuizData, ctx: MetricContext, recommendedPackage?: string): QuickWin[] {
  const { leads, leakRate, jobValue } = ctx;
  const leakedLeads = leads * leakRate;
  const recoveredLeads = Math.round(leakedLeads * RECOVERY_RATE);
  const recoveredMonthly = recoveredLeads * jobValue;
  const recoveredAnnual = recoveredMonthly * 12;

  const wins: QuickWin[] = [];

  // AI Receptionist — missed_leads + poor response method
  if (
    data.biggest_challenges.includes("missed_leads") &&
    (data.lead_response === "voicemail" || data.lead_response === "office_pickup")
  ) {
    wins.push({
      id: "ai_receptionist",
      title: "AI Receptionist",
      description: "24/7 conversational AI that answers calls, qualifies leads, and books appointments. Trained on your business — every missed call becomes an opportunity.",
      service: "AI Receptionist / Voice Agent",
      priceRange: "$2,500 – $4,000",
      timeline: "2–3 weeks",
      recoveredLeads,
      recoveredMonthly,
      recoveredAnnual,
      roiProjection: buildRoiString(leads, leakRate, jobValue, recoveredLeads, recoveredMonthly),
      ctaLabel: "Learn About AI Receptionists",
      ctaHref: "/book",
      interest: "aireceptionist",
      priority: 1,
    });
  }

  // Speed-to-Lead — pipeline stuck
  if (data.biggest_challenges.includes("pipeline_stuck")) {
    const stlRecovered = Math.round(leakedLeads * 0.40);
    const stlMonthly = stlRecovered * jobValue;
    wins.push({
      id: "speed_to_lead",
      title: "Speed-to-Lead System",
      description: "Automated instant response to every new inquiry. Respond in under 60 seconds — leads contacted within 5 minutes are 21× more likely to convert.",
      service: "Speed-to-Lead Build",
      priceRange: "$2,000 – $3,000",
      timeline: "1–2 weeks",
      recoveredLeads: stlRecovered,
      recoveredMonthly: stlMonthly,
      recoveredAnnual: stlMonthly * 12,
      roiProjection: buildRoiString(leads, leakRate, jobValue, stlRecovered, stlMonthly),
      ctaLabel: "Build My Speed-to-Lead",
      ctaHref: "/book",
      interest: "speedtolead",
      priority: 2,
    });
  }

  // Custom Workflow — manual tasks
  if (data.biggest_challenges.includes("manual_tasks")) {
    const cwRecovered = Math.round(leakedLeads * 0.30);
    const cwMonthly = cwRecovered * jobValue;
    wins.push({
      id: "custom_workflow",
      title: "Custom Workflow Automation",
      description: "One high-impact automated workflow — estimate follow-up, job status notifications, vendor coordination, or scheduling. Eliminates the manual bottleneck.",
      service: "Custom Workflow Build",
      priceRange: "$3,000 – $7,000",
      timeline: "2–4 weeks",
      recoveredLeads: cwRecovered,
      recoveredMonthly: cwMonthly,
      recoveredAnnual: cwMonthly * 12,
      roiProjection: buildRoiString(leads, leakRate, jobValue, cwRecovered, cwMonthly),
      ctaLabel: "Scope Your Workflow",
      ctaHref: "/book",
      interest: "workflow",
      priority: 3,
    });
  }

  // AI Front Office — tool disconnect
  if (data.biggest_challenges.includes("tool_disconnect")) {
    const foRecovered = Math.round(leakedLeads * 0.45);
    const foMonthly = foRecovered * jobValue;
    wins.push({
      id: "ai_front_office",
      title: "AI Front Office System",
      description: "Unified AI-powered front office: voice agents, automated lead response, smart routing, follow-up, and CRM integration. One system, zero gaps.",
      service: "AI Front Office System",
      priceRange: "$8,000 – $15,000",
      timeline: "6–10 weeks",
      recoveredLeads: foRecovered,
      recoveredMonthly: foMonthly,
      recoveredAnnual: foMonthly * 12,
      roiProjection: buildRoiString(leads, leakRate, jobValue, foRecovered, foMonthly),
      ctaLabel: "Explore AI Front Office",
      ctaHref: "/book",
      interest: "frontoffice",
      priority: 4,
    });
  }

  const recommendedStack = recommendedPackage ? getRecommendedStack(recommendedPackage) : null;
  if (recommendedStack) {
    wins.push(buildPrimaryStackWin(recommendedStack, leakedLeads, jobValue));
  }

  const sorted = wins
    .filter((w) => w.isPrimary || w.recoveredMonthly >= MIN_MONTHLY_ROI)
    .sort((a, b) => a.priority - b.priority);

  return sorted.slice(0, 3);
}

// ─── Debug: All quick wins with activation metadata ───
export function getAllQuickWinsDebug(data: QuizData, ctx: MetricContext, recommendedPackage: string): DebugQuickWin[] {
  const { leads, leakRate, jobValue } = ctx;
  const leakedLeads = leads * leakRate;

  const definitions: { win: QuickWin; triggerMet: boolean; triggerDescription: string }[] = [
    {
      triggerMet: data.biggest_challenges.includes("missed_leads") && (data.lead_response === "voicemail" || data.lead_response === "office_pickup"),
      triggerDescription: 'challenges includes "missed_leads" AND response is voicemail or office_pickup',
      win: (() => {
        const r = Math.round(leakedLeads * RECOVERY_RATE);
        const m = r * jobValue;
        return { id: "ai_receptionist", title: "AI Receptionist", description: "24/7 conversational AI that answers calls, qualifies leads, and books appointments.", service: "AI Receptionist / Voice Agent", priceRange: "$2,500 – $4,000", timeline: "2–3 weeks", recoveredLeads: r, recoveredMonthly: m, recoveredAnnual: m * 12, roiProjection: buildRoiString(leads, leakRate, jobValue, r, m), ctaLabel: "Learn About AI Receptionists", ctaHref: "/book", interest: "aireceptionist", priority: 1 };
      })(),
    },
    {
      triggerMet: data.biggest_challenges.includes("pipeline_stuck"),
      triggerDescription: 'challenges includes "pipeline_stuck"',
      win: (() => {
        const r = Math.round(leakedLeads * 0.40);
        const m = r * jobValue;
        return { id: "speed_to_lead", title: "Speed-to-Lead System", description: "Automated instant response to every new inquiry.", service: "Speed-to-Lead Build", priceRange: "$2,000 – $3,000", timeline: "1–2 weeks", recoveredLeads: r, recoveredMonthly: m, recoveredAnnual: m * 12, roiProjection: buildRoiString(leads, leakRate, jobValue, r, m), ctaLabel: "Build My Speed-to-Lead", ctaHref: "/book", interest: "speedtolead", priority: 2 };
      })(),
    },
    {
      triggerMet: data.biggest_challenges.includes("manual_tasks"),
      triggerDescription: 'challenges includes "manual_tasks"',
      win: (() => {
        const r = Math.round(leakedLeads * 0.30);
        const m = r * jobValue;
        return { id: "custom_workflow", title: "Custom Workflow Automation", description: "One high-impact automated workflow.", service: "Custom Workflow Build", priceRange: "$3,000 – $7,000", timeline: "2–4 weeks", recoveredLeads: r, recoveredMonthly: m, recoveredAnnual: m * 12, roiProjection: buildRoiString(leads, leakRate, jobValue, r, m), ctaLabel: "Scope Your Workflow", ctaHref: "/book", interest: "workflow", priority: 3 };
      })(),
    },
    {
      triggerMet: data.biggest_challenges.includes("tool_disconnect"),
      triggerDescription: 'challenges includes "tool_disconnect"',
      win: (() => {
        const r = Math.round(leakedLeads * 0.45);
        const m = r * jobValue;
        return { id: "ai_front_office", title: "AI Front Office System", description: "Unified AI-powered front office.", service: "AI Front Office System", priceRange: "$8,000 – $15,000", timeline: "6–10 weeks", recoveredLeads: r, recoveredMonthly: m, recoveredAnnual: m * 12, roiProjection: buildRoiString(leads, leakRate, jobValue, r, m), ctaLabel: "Explore AI Front Office", ctaHref: "/book", interest: "frontoffice", priority: 4 };
      })(),
    },
  ];

  // Primary product recommendations
  const primaryDefs = (Object.keys(RECOMMENDED_STACKS) as RecommendedStackLabel[]).map((label) => ({
    label,
    triggerDescription: `recommendedPackage === "${label}"`,
    win: buildPrimaryStackWin(RECOMMENDED_STACKS[label], leakedLeads, jobValue),
  }));

  // Build the filtered set to determine top 3
  const activeWins = getQuickWins(data, ctx, recommendedPackage);
  const topThreeIds = new Set(activeWins.map(w => w.id));

  // Annotate conditional wins
  const result: DebugQuickWin[] = definitions.map(d => ({
    ...d.win,
    triggerMet: d.triggerMet,
    meetsRoiThreshold: d.win.recoveredMonthly >= MIN_MONTHLY_ROI,
    inTopThree: topThreeIds.has(d.win.id),
    triggerDescription: d.triggerDescription,
  }));

  // Annotate primary products
  for (const def of primaryDefs) {
    result.push({
      ...def.win,
      triggerMet: recommendedPackage === def.label,
      meetsRoiThreshold: true,
      inTopThree: topThreeIds.has(def.win.id),
      triggerDescription: def.triggerDescription,
    });
  }

  return result.sort((a, b) => a.priority - b.priority);
}
