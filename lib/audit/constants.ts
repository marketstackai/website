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

// ─── Team-Size Lead Fallbacks ───
export const TEAM_SIZE_BASE_LEADS: Record<string, number> = {
  solo: 8,
  "2_10": 20,
  "11_50": 50,
  "51_200": 90,
  "200_plus": 130,
};

// ─── Lead Bounds by Revenue (derived from raw dollar amount) ───
export function getLeadBoundsForRevenue(revenue: number): { floor: number; ceiling: number } {
  if (revenue < 50_000) return { floor: 5, ceiling: 40 };
  if (revenue < 100_000) return { floor: 10, ceiling: 80 };
  if (revenue < 250_000) return { floor: 20, ceiling: 150 };
  if (revenue < 500_000) return { floor: 30, ceiling: 250 };
  return { floor: 50, ceiling: 500 };
}

// ─── Revenue Score (maps raw dollar amount to scoring tier) ───
export function getRevenueScore(revenue: string): number {
  if (!revenue || revenue === "undisclosed") return 0;
  const num = parseFloat(revenue);
  if (isNaN(num) || num <= 0) return 0;
  if (num < 50_000) return 1;
  if (num < 100_000) return 2;
  if (num < 250_000) return 3;
  if (num < 500_000) return 4;
  return 5;
}

// ─── Scoring Matrices ───
export const SCORES: Record<string, Record<string, number>> = {
  team_size: { solo: 1, "2_10": 2, "11_50": 3, "51_200": 4, "200_plus": 4 },
  biggest_challenge: { missed_leads: 2, pipeline_stuck: 3, manual_tasks: 4, no_visibility: 3, tool_disconnect: 4, unsure_ai: 1 },
  lead_response: { voicemail: 1, office_pickup: 2, auto_response: 3, ai_system: 4 },
  ai_experience: { no_ai: 1, ai_poor_results: 2, ai_some_results: 3, ai_advanced: 4 },
  urgency: { urgent: 4, "1_3_months": 3, "3_6_months": 2, exploring: 1 },
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

