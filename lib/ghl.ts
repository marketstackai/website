export const GHL_FIELDS = {
  SMS_CONSENT: "gEW3wbkH3Ozl2t9AvEL5",
  MARKETING_CONSENT: "JnitmKqDrHkP7JOCcY41",
  RECOMMENDATION: "ukVdGi6W4efUGx3SIqHG",
} as const;

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
