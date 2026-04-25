// ─── Industry Default Job Values (used if undisclosed) ───
export const INDUSTRY_DEFAULT_JOB_VALUES: Record<string, number> = {
  home_services: 3500,
  real_estate: 8000,
  professional_service: 2500,
  tech: 5000,
  ecom: 250,
  other: 1000,
};

// ─── Industry Multipliers (lead volume adjustment) ───
export const INDUSTRY_MULTIPLIERS: Record<string, number> = {
  home_services: 1.3,
  real_estate: 0.9,
  professional_service: 0.7,
  tech: 1.0,
  ecom: 1.5,
  other: 1.0,
};

// ─── Industry Leak Rate Modifiers ───
export const INDUSTRY_LEAK_MODIFIERS: Record<string, number> = {
  home_services: 0.05,
  real_estate: 0.03,
  professional_service: 0.0,
  tech: 0.0,
  ecom: -0.10,
  other: 0.0,
};

// ─── Base Leak Rates by Response Method ───
export const BASE_LEAK_RATES: Record<string, number> = {
  voicemail: 0.60,
  office_pickup: 0.40,
  auto_response: 0.25,
  ai_system: 0.10,
};

// ─── Close Rate Defaults by Tier ───
export const DEFAULT_CLOSE_RATES: Record<string, number> = {
  Foundation: 0.15,
  Growth: 0.25,
  Optimization: 0.35,
};

// ─── Team-Size Lead Fallbacks (by bucket key) ───
export const TEAM_SIZE_BASE_LEADS: Record<string, number> = {
  "1_3": 8,
  "4_9": 20,
  "10_20": 40,
  "21_49": 75,
  "50_plus": 130,
};

// ─── Lead Bounds by Revenue (derived from raw dollar amount) ───
export function getLeadBoundsForRevenue(revenue: number): { floor: number; ceiling: number } {
  if (revenue < 10_000) return { floor: 1, ceiling: 10 };
  if (revenue < 50_000) return { floor: 3, ceiling: 25 };
  if (revenue < 100_000) return { floor: 10, ceiling: 80 };
  if (revenue < 250_000) return { floor: 20, ceiling: 150 };
  if (revenue < 500_000) return { floor: 30, ceiling: 250 };
  if (revenue < 1_000_000) return { floor: 50, ceiling: 500 };
  return { floor: 100, ceiling: 1000 };
}

// ─── Revenue Score (maps raw monthly-dollar amount to weighted points) ───
// Back-loaded floor-zero on a 20-pt weight. Undisclosed returns 0 and the
// engine renormalizes the denominator (see ITEM_WEIGHTS usage).
export function getRevenueScore(revenue: string): number {
  if (!revenue || revenue === "undisclosed") return 0;
  const num = parseFloat(revenue);
  if (isNaN(num) || num <= 0) return 0;
  if (num < 10_000) return 0;
  if (num < 50_000) return 2;
  if (num < 100_000) return 4;
  if (num < 250_000) return 8;
  if (num < 500_000) return 13;
  if (num < 1_000_000) return 17;
  return 20;
}

// ─── Item weights (out of 100) — source of truth for renormalization ───
export const ITEM_WEIGHTS = {
  team_size: 15,
  monthly_revenue: 20,
  lead_response: 15,
  biggest_challenge: 20,
  ai_experience: 20,
  urgency: 10,
} as const;

// ─── Tier thresholds (on the 0–100 scale) ───
export const TIER_THRESHOLDS = {
  growth: 50,        // >= 50 promotes from Foundation to Growth
  optimization: 85,  // >= 85 promotes to Optimization
} as const;

// ─── Scoring Matrices (values sum to each item's weight) ───
export const SCORES: Record<string, Record<string, number>> = {
  // 15-pt weight · floor-zero · buckets keyed to getTeamBucket() output
  team_size: { "1_3": 0, "4_9": 4, "10_20": 8, "21_49": 11, "50_plus": 15 },
  // 20-pt weight · max-of-selected · boosted missed_leads, muted unsure_ai
  biggest_challenge: { missed_leads: 15, pipeline_stuck: 15, manual_tasks: 20, no_visibility: 15, tool_disconnect: 20, unsure_ai: 2 },
  // 15-pt weight · bell curve peaking at auto_response (Market Stack's sweet-spot prospect)
  lead_response: { voicemail: 2, office_pickup: 8, auto_response: 15, ai_system: 11 },
  // 20-pt weight · ascending, generous to poor_results
  ai_experience: { no_ai: 3, ai_poor_results: 12, ai_some_results: 16, ai_advanced: 20 },
  // 10-pt weight · floor-zero
  urgency: { urgent: 10, "1_3_months": 7, "3_6_months": 3, exploring: 0 },
};

// ─── Human-Readable Labels ───
export const INDUSTRY_LABELS: Record<string, string> = {
  home_services: "Home Services",
  real_estate: "Real Estate",
  professional_service: "Professional Services",
  tech: "Technology",
  ecom: "E-Commerce",
  other: "Other",
};

export const RESPONSE_METHOD_LABELS: Record<string, string> = {
  voicemail: "Voicemail",
  office_pickup: "Answering Service",
  auto_response: "Auto Text-Back",
  ai_system: "AI Receptionist",
};
