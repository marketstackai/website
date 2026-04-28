import { NextResponse } from "next/server";
import { buildAuditEmail, type AuditEmailData } from "@/lib/audit/email";
import { GHL_FIELDS, normalizeIndustry, parseConsent } from "@/lib/ghl";
import { INTEREST_SUBHEADINGS } from "@/lib/booking";

const GHL_BASE = "https://services.leadconnectorhq.com";
const VALID_INTERESTS: Set<string> = new Set(Object.keys(INTEREST_SUBHEADINGS));

interface GHLContact {
  id: string;
  email: string;
  customFields?: { id: string; value: unknown }[];
}

interface GHLContactsResponse {
  contacts: GHLContact[];
}

async function lookupContactByEmail(
  email: string,
  apiKey: string,
  locationId: string,
): Promise<string | null> {
  const res = await fetch(
    `${GHL_BASE}/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: "2021-07-28",
      },
    },
  );
  if (!res.ok) return null;
  const data = (await res.json()) as GHLContactsResponse;
  const normalized = email.trim().toLowerCase();
  return data.contacts?.find((c) => c.email?.trim().toLowerCase() === normalized)?.id ?? null;
}

// Users who submit the audit quickly can hit a race: the GHL external-form tracker
// creates the contact asynchronously on form submit, and the search index is eventually
// consistent. Retry for up to ~20s before giving up.
const LOOKUP_RETRY_DELAYS_MS = [0, 1500, 2000, 2500, 3000, 3500, 4000, 4500] as const;

async function lookupContactWithRetry(
  email: string,
  apiKey: string,
  locationId: string,
): Promise<string | null> {
  for (const waitMs of LOOKUP_RETRY_DELAYS_MS) {
    if (waitMs > 0) await new Promise((r) => setTimeout(r, waitMs));
    const id = await lookupContactByEmail(email, apiKey, locationId);
    if (id) return id;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, business_name, company_name, sms_consent, marketing_consent, source_industry, interest, contact_updates, audit_record, computed_email } = body as {
      email: string;
      full_name?: string;
      business_name?: string;
      company_name?: string;
      sms_consent?: boolean;
      marketing_consent?: boolean;
      source_industry?: string;
      interest?: string;
      contact_updates?: {
        tags_add?: string[];
        customField?: Record<string, string>;
      };
      audit_record?: Record<string, unknown>;
      computed_email?: Omit<AuditEmailData, "reportUrl">;
    };

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      console.error("Missing GHL API credentials");
      return NextResponse.json(
        { success: false, error: "API integration not configured" },
        { status: 503 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing email" },
        { status: 400 },
      );
    }

    // 1. Resolve contact ID via email lookup with retry
    const contactId = await lookupContactWithRetry(email, apiKey, locationId);

    if (!contactId) {
      console.warn(`No GHL contact found for ${email}`);
      return NextResponse.json({ success: true });
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
    };

    // 2. Append interest to GHL Interests field (read-then-write to avoid overwriting)
    if (interest && VALID_INTERESTS.has(interest)) {
      const contactRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${apiKey}`, Version: "2021-07-28" },
      });
      if (contactRes.ok) {
        const { contact } = (await contactRes.json()) as { contact: GHLContact };
        const existingField = contact.customFields?.find((f) => f.id === GHL_FIELDS.INTERESTS);
        const currentInterests: string[] = Array.isArray(existingField?.value)
          ? (existingField.value as string[])
          : [];
        if (!currentInterests.includes(interest)) {
          await fetch(`${GHL_BASE}/contacts/${contactId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({
              customFields: [{ id: GHL_FIELDS.INTERESTS, value: [...currentInterests, interest] }],
            }),
          });
        }
      }
    }

    // 4. Update contact details (name, company) if provided
    const contactUpdatePayload: Partial<{
      firstName: string;
      lastName: string;
      companyName: string;
    }> = {};
    if (full_name) {
      const parts = full_name.split(" ");
      contactUpdatePayload.firstName = parts[0];
      contactUpdatePayload.lastName = parts.slice(1).join(" ");
    }
    const finalBusinessName = company_name || business_name;
    if (finalBusinessName) {
      contactUpdatePayload.companyName = finalBusinessName;
    }

    if (Object.keys(contactUpdatePayload).length > 0) {
      const updateRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(contactUpdatePayload),
      });
      if (!updateRes.ok) {
        console.error("Failed to update contact base info:", updateRes.status, await updateRes.text());
      }
    }

    // 5. Update contact tags / custom fields
    {
      const tagsToAdd = contact_updates?.tags_add ?? [];
      if (tagsToAdd.length > 0) {
        const tagRes = await fetch(`${GHL_BASE}/contacts/${contactId}/tags`, {
          method: "POST",
          headers,
          body: JSON.stringify({ tags: tagsToAdd }),
        });
        if (!tagRes.ok) {
          console.error("Failed to add tags:", tagRes.status, await tagRes.text());
        }
      }

      const customFieldIdMap: Record<string, string> = {
        recommended: GHL_FIELDS.RECOMMENDATION,
      };

      // Build custom fields from contact_updates + consent
      const customFields: { id: string; value: string }[] = [];

      if (contact_updates?.customField) {
        for (const [key, value] of Object.entries(contact_updates.customField)) {
          const id = customFieldIdMap[key];
          if (id) customFields.push({ id, value });
        }
      }

      if (source_industry && GHL_FIELDS.SOURCE_INDUSTRY) {
        customFields.push({ id: GHL_FIELDS.SOURCE_INDUSTRY, value: normalizeIndustry(source_industry) });
      }

      if (sms_consent !== undefined) {
        customFields.push({ id: GHL_FIELDS.SMS_CONSENT, value: parseConsent(sms_consent) });
      }
      if (marketing_consent !== undefined) {
        customFields.push({ id: GHL_FIELDS.MARKETING_CONSENT, value: parseConsent(marketing_consent) });
      }

      if (customFields.length > 0) {
        const cfRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ customFields }),
        });
        if (!cfRes.ok) {
          console.error("Failed to update custom fields:", cfRes.status, await cfRes.text());
        }
      }
    }

    // 3. Create Audit Custom Object Record
    let recordId: string | null = null;
    if (audit_record) {
      const recordRes = await fetch(
        `${GHL_BASE}/objects/custom_objects.audit/records`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationId,
            properties: {
              name: `${company_name || business_name || full_name || "Audit"} - ${email}`,
              ...audit_record,
              // NUMERICAL fields must be numbers
              team_size: Number(audit_record.team_size) || 0,
              monthly_revenue: Number(audit_record.monthly_revenue) || 0,
              avg_job_value: Number(audit_record.avg_job_value) || 0,
              monthly_leads: Number(audit_record.monthly_leads) || 0,
              // MULTIPLE_OPTIONS expects an array
              biggest_challenges: Array.isArray(audit_record.biggest_challenges)
                ? audit_record.biggest_challenges
                : audit_record.biggest_challenges
                  ? String(audit_record.biggest_challenges)
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                  : [],
            },
          }),
        },
      );

      if (recordRes.ok) {
        const recordData = await recordRes.json();
        recordId = recordData.record?.id ?? null;
      } else {
        console.error("Failed to create audit record:", recordRes.status, await recordRes.text());
      }

      // 4. Associate record with contact
      // associationId = the relation definition between "contact" and "custom_objects.audit"
      const ASSOCIATION_ID = process.env.GHL_AUDIT_ASSOCIATION_ID ?? "69cb019b83fc21e8f5928b7a";
      if (recordId) {
        const assocRes = await fetch(`${GHL_BASE}/associations/relations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationId,
            associationId: ASSOCIATION_ID,
            firstRecordId: contactId,
            secondRecordId: recordId,
          }),
        });
        if (!assocRes.ok) {
          const assocErr = await assocRes.text();
          console.error("Association failed:", assocRes.status, assocErr);
        }
      }
    }

    // 5. Send audit results email
    if (contactId && computed_email) {
      const siteUrl = process.env.NEXT_PUBLIC_URL ?? "https://marketstack.ai";
      const reportUrl = recordId ? `${siteUrl}/audit/report?id=${recordId}` : siteUrl;
      const html = buildAuditEmail({ ...computed_email, reportUrl });
      const emailRes = await fetch(`${GHL_BASE}/conversations/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "Email",
          contactId,
          subject: "Your AI Readiness Report",
          html,
        }),
      });
      if (!emailRes.ok) {
        console.error("Failed to send audit email:", emailRes.status, await emailRes.text());
      }
    }

    return NextResponse.json({ success: true, recordId });
  } catch (error: unknown) {
    console.error("Audit Complete API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
