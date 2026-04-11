import type { QuizData, AuditResults, TierLabel, AdjustableParams, RecalculatedValues } from "./types";
import {
  INDUSTRY_MULTIPLIERS, INDUSTRY_LEAK_MODIFIERS,
  BASE_LEAK_RATES, DEFAULT_CLOSE_RATES, TEAM_SIZE_BASE_LEADS,
  getLeadBoundsForRevenue, getRevenueScore,
  SCORES,
  INDUSTRY_DEFAULT_JOB_VALUES,
} from "./constants";
import { getQuickWins } from "./recommendations";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getTeamBucket(val: string): string {
  const n = parseInt(val);
  if (isNaN(n)) return val;
  if (n <= 1) return "solo";
  if (n <= 10) return "2_10";
  if (n <= 50) return "11_50";
  if (n <= 200) return "51_200";
  return "200_plus";
}

// ─── Step 1: Compute leads/mo ───
function computeLeads(
  revenue: string,
  teamSize: string,
  jobValue: number,
  industry: string,
  closeRate: number,
): number {
  const industryMult = INDUSTRY_MULTIPLIERS[industry] ?? 1.0;

  const revenueNum = parseFloat(revenue);
  if (!isNaN(revenueNum) && revenueNum > 0 && jobValue > 0) {
    const completedJobs = revenueNum / jobValue;
    const rawLeads = Math.round((completedJobs / closeRate) * industryMult);
    const bounds = getLeadBoundsForRevenue(revenueNum);
    const leads = Math.round(clamp(rawLeads, bounds.floor, bounds.ceiling));

    return leads;
  }

  // Fallback: team-size path
  const bucket = getTeamBucket(teamSize);
  const baseLeads = TEAM_SIZE_BASE_LEADS[bucket] ?? 8;
  const leads = Math.round(baseLeads * industryMult);

  return leads;
}

// ─── Step 2: Compute leak rate ───
function computeLeakRate(
  responseMethod: string,
  industry: string,
): number {
  const baseRate = BASE_LEAK_RATES[responseMethod] ?? 0.40;
  const modifier = INDUSTRY_LEAK_MODIFIERS[industry] ?? 0;
  const leakRate = clamp(baseRate + modifier, 0.05, 0.85);

  return leakRate;
}

// ─── Step 5: Score & Tier (runs before close rate) ───
function computeScoreAndTier(
  data: QuizData,
): { totalScore: number; tierLabel: TierLabel; tierText: string; recommendedPackage: string } {
  const teamBucket = getTeamBucket(data.team_size);
  let totalScore = 0;

  totalScore += SCORES.team_size[teamBucket] ?? 0;
  totalScore += getRevenueScore(data.monthly_revenue);
  totalScore += SCORES.lead_response[data.lead_response] ?? 0;
  totalScore += SCORES.ai_experience[data.ai_experience] ?? 0;
  totalScore += SCORES.urgency[data.urgency] ?? 0;

  totalScore += data.biggest_challenges.reduce(
    (max, c) => Math.max(max, SCORES.biggest_challenge[c] ?? 0),
    0,
  );

  const includesRevenue = data.monthly_revenue && data.monthly_revenue !== "undisclosed";

  let tierLabel: TierLabel = "Foundation";
  let tierText = "Foundation Stage";
  let recommendedPackage = "Foundation Kit";

  if (includesRevenue) {
    if (totalScore >= 21) {
      tierLabel = "Optimization"; tierText = "Optimization Stage"; recommendedPackage = "Studio";
    } else if (totalScore >= 13) {
      tierLabel = "Growth"; tierText = "Growth Stage"; recommendedPackage = "Operating System";
    }
  } else {
    if (totalScore >= 17) {
      tierLabel = "Optimization"; tierText = "Optimization Stage"; recommendedPackage = "Studio";
    } else if (totalScore >= 11) {
      tierLabel = "Growth"; tierText = "Growth Stage"; recommendedPackage = "Operating System";
    }
  }

  return { totalScore, tierLabel, tierText, recommendedPackage };
}

// ─── Main compute function ───
export function computeResults(data: QuizData & { industry: string }): AuditResults {
  const industry = data.industry;
  const rawJobValue = parseFloat(data.avg_job_value);
  const isJobValueUndisclosed = data.avg_job_value === "undisclosed";
  const defaultJobValue = INDUSTRY_DEFAULT_JOB_VALUES[industry] ?? 1000;
  const jobValue = isJobValueUndisclosed ? defaultJobValue : (isNaN(rawJobValue) ? 0 : rawJobValue);
  const industryMult = INDUSTRY_MULTIPLIERS[industry] ?? 1.0;

  // Step 1: Score & Tier (computed first — close rate is needed for lead estimation)
  const { totalScore, tierLabel, tierText, recommendedPackage } = computeScoreAndTier(data);
  const closeRate = DEFAULT_CLOSE_RATES[tierLabel];

  // Step 2: Leads — use user-provided value if available, otherwise estimate
  const userLeads = parseFloat(data.monthly_leads);
  const isLeadsUserProvided = !isNaN(userLeads) && userLeads > 0;

  let leads: number;

  if (isLeadsUserProvided) {
    leads = Math.round(userLeads);
  } else {
    leads = computeLeads(data.monthly_revenue, data.team_size, jobValue, industry, closeRate);
  }

  // Step 3: Leak rate
  const leakRate = computeLeakRate(data.lead_response, industry);

  // Step 4: Revenue leak calculations
  // Max Impact (no close rate)
  const maxImpactMonthly = leads * leakRate * jobValue;
  const maxImpactAnnual = maxImpactMonthly * 12;

  // Realistic (with close rate)
  const realisticMonthly = leads * leakRate * closeRate * jobValue;
  const realisticAnnual = realisticMonthly * 12;

  // Conservative / Optimistic (Max Impact)
  const conservativeLeads = Math.round(leads * 0.7);
  const optimisticLeads = Math.round(leads * 1.3);
  const conservativeMonthly = conservativeLeads * Math.max(leakRate - 0.05, 0.05) * jobValue;
  const optimisticMonthly = optimisticLeads * Math.min(leakRate + 0.05, 0.85) * jobValue;

  // Conservative / Optimistic (Realistic)
  const conservativeRealistic = conservativeLeads * Math.max(leakRate - 0.05, 0.05) * Math.max(closeRate - 0.05, 0.05) * jobValue;
  const optimisticRealistic = optimisticLeads * Math.min(leakRate + 0.05, 0.85) * Math.min(closeRate + 0.10, 0.50) * jobValue;


  // Flags
  const teamN = parseInt(data.team_size) || 0;
  const revenueNum = parseFloat(data.monthly_revenue) || 0;
  const hotLead = data.urgency === "urgent" && totalScore >= 13;
  const highTicket = revenueNum > 50_000;
  const quickWinOpp = data.biggest_challenges.includes("missed_leads") && (SCORES.lead_response[data.lead_response] ?? 0) <= 2;
  const enterpriseSignal = teamN >= 50 || (teamN > 10 && revenueNum > 100_000);
  const nurtureTrack = data.urgency === "exploring";
  const needsReview = data.industry === "other" && !data.industry_other;

  // Quick wins
  const quickWins = getQuickWins(data, { leads, leakRate, closeRate, jobValue }, recommendedPackage);

  // AI Readiness matrix
  let aiScore: "Low" | "Moderate" | "High" = "Low";
  let aiDescription = "";

  if (tierLabel === "Foundation") {
    aiScore = "Low";
    aiDescription = "Focus on locking down core systems first before introducing AI.";
  } else if (tierLabel === "Growth") {
    if (data.ai_experience === "ai_advanced" || data.ai_experience === "ai_some_results") {
      aiScore = "Moderate";
      aiDescription = "Infrastructure is scaling and your team has the mindset to introduce conversational AI.";
    } else {
      aiScore = "Low";
      aiDescription = "Focus on traditional automation workflows before exploring AI.";
    }
  } else if (tierLabel === "Optimization") {
    if (data.ai_experience === "ai_advanced") {
      aiScore = "High";
      aiDescription = "Perfect alignment. Fully primed to deploy bespoke AI agents for maximum leverage.";
    } else {
      aiScore = "Moderate";
      aiDescription = "Systems are pristine. Start introducing structured AI workflows for massive uncaptured scale.";
    }
  }

  return {
    leads, leakRate, closeRate, jobValue,
    industryMultiplier: industryMult, industry,
    maxImpactMonthly, maxImpactAnnual,
    realisticMonthly, realisticAnnual,
    conservativeMonthly, optimisticMonthly,
    conservativeRealistic, optimisticRealistic,
    totalScore, tierLabel, tierText, recommendedPackage,
    hotLead, highTicket, quickWinOpp, enterpriseSignal, nurtureTrack, needsReview,
    isRevenueUndisclosed: data.monthly_revenue === "undisclosed",
    isJobValueUndisclosed,
    isLeadsUserProvided,
    aiReadiness: {
      score: aiScore,
      description: aiDescription,
    },
    quickWins,
  };
}

// ─── Recalculate from adjusted parameters ───
export function recalculate(params: AdjustableParams): RecalculatedValues {
  const maxImpactMonthly = params.leads * params.leakRate * params.jobValue;
  const realisticMonthly = params.leads * params.leakRate * params.closeRate * params.jobValue;

  return {
    maxImpactMonthly,
    maxImpactAnnual: maxImpactMonthly * 12,
    realisticMonthly,
    realisticAnnual: realisticMonthly * 12,
  };
}
