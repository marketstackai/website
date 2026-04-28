export const GHL_FIELDS = {
  SMS_CONSENT: "gEW3wbkH3Ozl2t9AvEL5",
  MARKETING_CONSENT: "JnitmKqDrHkP7JOCcY41",
  RECOMMENDATION: "ukVdGi6W4efUGx3SIqHG",
  SOURCE_INDUSTRY: "AR4nCG06ilvglIvl7XqM",
  INTERESTS: "6OW3rNue3BDI1P0zB7qc",
} as const;

// GHL SINGLE_OPTIONS values for the Source Industry field. These are the
// human-readable labels configured in the GHL admin — sending the underscored
// form does not match an option and the field stays empty.
type CanonicalIndustry =
  | "Home Services"
  | "Real Estate"
  | "Professional Service"
  | "E-Commerce"
  | "Tech"
  | "Other";

const INDUSTRY_MAP: Record<string, CanonicalIndustry> = {
  // quiz values (underscore form)
  home_services: "Home Services",
  real_estate: "Real Estate",
  professional_service: "Professional Service",
  professional_services: "Professional Service",
  tech: "Tech",
  ecom: "E-Commerce",
  ecommerce: "E-Commerce",
  e_commerce: "E-Commerce",
  manufactured_homes: "Real Estate",
  // industry page slugs (hyphen form normalised to underscore before lookup)
  tech_gtm: "Tech",
  builders: "Home Services",
  lender: "Real Estate",
};

export function normalizeIndustry(raw: string): CanonicalIndustry {
  const key = raw.trim().toLowerCase().replace(/-/g, "_");
  return INDUSTRY_MAP[key] ?? "Other";
}

/**
 * Normalizes consent values to "Yes" or "No" for GHL custom fields.
 * Handles booleans, strings ("Yes", "true", "on"), and null/undefined.
 */
export function parseConsent(val: string | boolean | undefined | null): "Yes" | "No" {
  if (val === undefined || val === null) return "No";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  const s = String(val).toLowerCase().trim();
  if (s === "yes" || s === "true" || s === "on" || s === "1") return "Yes";
  return "No";
}
