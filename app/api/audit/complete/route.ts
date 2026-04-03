import { NextResponse } from "next/server";
import { buildAuditEmail, type AuditEmailData } from "@/lib/audit/email";

const GHL_BASE = "https://services.leadconnectorhq.com";

interface GHLContact {
  id: string;
  email: string;
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
  return data.contacts?.find((c) => c.email === email)?.id ?? null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, business_name, contact_updates, audit_record, computed_email } = body as {
      email: string;
      full_name?: string;
      business_name?: string;
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

    // 1. Look up contact by email
    const contactId = await lookupContactByEmail(email, apiKey, locationId);
    if (!contactId) {
      console.warn(`No GHL contact found for ${email}`);
      return NextResponse.json({ success: true });
    }

    // 2. Update contact tags / custom fields
    if (contact_updates) {
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      };

      const tagsToAdd = contact_updates.tags_add || [];
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

      if (contact_updates.customField) {
        const cfRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            customFields: Object.entries(contact_updates.customField).map(
              ([key, value]) => ({ id: key, field_value: value }),
            ),
          }),
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
              name: `${business_name || full_name || "Audit"} - ${email}`,
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
