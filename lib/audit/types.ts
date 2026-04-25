export interface QuizData {
  industry: string;
  industry_other: string;
  team_size: string;
  monthly_revenue: string;
  avg_job_value: string;
  monthly_leads: string;
  biggest_challenges: string[];
  lead_response: string;
  ai_experience: string;
  ai_detail: string;
  urgency: string;
  additional_notes: string;
}

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  website: string;
  sms_consent: boolean;
  marketing_consent: boolean;
}

export type TierLabel = "Foundation" | "Growth" | "Optimization";

export interface AuditResults {
  // Core metrics
  leads: number;
  leakRate: number;
  closeRate: number;
  jobValue: number;
  industryMultiplier: number;
  industry: string;

  // Max Impact (no close rate)
  maxImpactMonthly: number;
  maxImpactAnnual: number;

  // Realistic (with close rate)
  realisticMonthly: number;
  realisticAnnual: number;

  // Conservative / Optimistic ranges (Max Impact)
  conservativeMonthly: number;
  optimisticMonthly: number;

  // Conservative / Optimistic ranges (Realistic)
  conservativeRealistic: number;
  optimisticRealistic: number;

  // Scoring
  totalScore: number;
  tierLabel: TierLabel;
  tierText: string;
  recommendedPackage: string;

  // Flags
  hotLead: boolean;
  highTicket: boolean;
  quickWinOpp: boolean;
  enterpriseSignal: boolean;
  nurtureTrack: boolean;
  needsReview: boolean;
  isRevenueUndisclosed: boolean;
  isJobValueUndisclosed: boolean;
  isLeadsUserProvided: boolean;

  // AI Readiness
  aiReadiness: {
    score: "Low" | "Moderate" | "High";
    description: string;
  };

  // Quick wins
  quickWins: QuickWin[];

}

export interface QuickWin {
  id: string;
  title: string;
  description: string;
  service: string;
  priceRange: string;
  timeline: string;
  recoveredLeads: number;
  recoveredMonthly: number;
  recoveredAnnual: number;
  roiProjection: string;
  ctaLabel: string;
  ctaHref: string;
  interest?: string;
  priority: number;
  isPrimary?: boolean;
}

export interface GHLAuditRecord {
  website: string;
  industry: string;
  industry_other: string;
  team_size: string;
  monthly_revenue: string;
  avg_job_value: string;
  monthly_leads: string;
  biggest_challenges: string[];
  lead_response: string;
  ai_experience: string;
  ai_detail: string;
  urgency: string;
  additional_notes: string;
  recommended: "foundation_kit" | "operating_system" | "studio";
}

export interface AdjustableParams {
  leads: number;
  leakRate: number;
  closeRate: number;
  jobValue: number;
}

export interface RecalculatedValues {
  maxImpactMonthly: number;
  maxImpactAnnual: number;
  realisticMonthly: number;
  realisticAnnual: number;
}
