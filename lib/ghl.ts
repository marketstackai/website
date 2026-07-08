const GHL_BASE = "https://services.leadconnectorhq.com";

export const GHL_FIELDS = {
  SMS_CONSENT: "gEW3wbkH3Ozl2t9AvEL5",
  MARKETING_CONSENT: "JnitmKqDrHkP7JOCcY41",
  RECOMMENDATION: "ukVdGi6W4efUGx3SIqHG",
  SOURCE_INDUSTRY: "AR4nCG06ilvglIvl7XqM",
  INTERESTS: "6OW3rNue3BDI1P0zB7qc",
} as const;

export function ghlHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  } as const;
}

interface GHLContact {
  id: string;
  customFields?: { id: string; value: unknown }[];
}

/**
 * Appends `interest` to the contact's multi-select Interests field (without
 * clobbering existing values) and optionally sets Source Industry.
 */
export async function tagContactInterest(
  contactId: string,
  interest: string,
  apiKey: string,
  sourceIndustry?: string,
): Promise<{ ok: true; updated: boolean } | { ok: false; error: string }> {
  const getRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
    headers: { Authorization: `Bearer ${apiKey}`, Version: "2021-07-28" },
  });

  if (!getRes.ok) {
    return { ok: false, error: "Contact not found" };
  }

  const { contact } = (await getRes.json()) as { contact: GHLContact };
  const existingField = contact.customFields?.find((f) => f.id === GHL_FIELDS.INTERESTS);
  const currentInterests: string[] = Array.isArray(existingField?.value)
    ? (existingField.value as string[])
    : [];

  if (currentInterests.includes(interest)) {
    return { ok: true, updated: false };
  }

  const updateRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
    method: "PUT",
    headers: ghlHeaders(apiKey),
    body: JSON.stringify({
      customFields: [
        { id: GHL_FIELDS.INTERESTS, value: [...currentInterests, interest] },
        ...(sourceIndustry && GHL_FIELDS.SOURCE_INDUSTRY
          ? [{ id: GHL_FIELDS.SOURCE_INDUSTRY, value: normalizeIndustry(sourceIndustry) }]
          : []),
      ],
    }),
  });

  if (!updateRes.ok) {
    return { ok: false, error: `Failed to update contact: ${updateRes.status}` };
  }

  return { ok: true, updated: true };
}

// GHL SINGLE_OPTIONS values for the Source Industry field. These are the
// human-readable labels configured in the GHL admin — sending the underscored
// form does not match an option and the field stays empty.
type CanonicalIndustry =
  | "Home Services"
  | "Real Estate"
  | "Professional Services"
  | "E-Commerce"
  | "Tech GTM"
  | "Other";

const INDUSTRY_MAP: Record<string, CanonicalIndustry> = {
  home_services: "Home Services",
  real_estate: "Real Estate",
  professional_service: "Professional Services",
  professional_services: "Professional Services",
  ecom: "E-Commerce",
  ecommerce: "E-Commerce",
  e_commerce: "E-Commerce",
  manufactured_homes: "Real Estate",
  tech_gtm: "Tech GTM",
  tech: "Tech GTM",
  builder: "Home Services",
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
