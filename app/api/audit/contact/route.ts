import { NextResponse } from "next/server";
import { GHL_FIELDS, parseConsent } from "@/lib/ghl";

const GHL_BASE = "https://services.leadconnectorhq.com";
const COMPANY_SYNC_DELAY_MS = 3200;
// Retry intervals (ms) between lookup attempts. Cumulative window: ~30s from route start,
// which covers slow GHL tracker submissions where the contact takes >5s to appear.
const COMPANY_SYNC_RETRY_DELAYS_MS = [0, 700, 1400, 2000, 3000, 4000, 5000, 5000, 5000] as const;

interface AuditCompanySyncRequest {
  email: string;
  company_name: string;
  sms_consent?: string | boolean;
  marketing_consent?: string | boolean;
}

interface GHLContact {
  id: string;
  email: string;
}

interface GHLContactsResponse {
  contacts: GHLContact[];
}

function ghlHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  } as const;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as GHLContactsResponse;
  const normalizedEmail = email.trim().toLowerCase();

  return (
    data.contacts?.find(
      (contact) => contact.email.trim().toLowerCase() === normalizedEmail,
    )?.id ?? null
  );
}

async function findExistingContactId(
  email: string,
  apiKey: string,
  locationId: string,
): Promise<string | null> {
  await sleep(COMPANY_SYNC_DELAY_MS);

  for (const waitMs of COMPANY_SYNC_RETRY_DELAYS_MS) {
    if (waitMs > 0) {
      await sleep(waitMs);
    }

    const contactId = await lookupContactByEmail(email, apiKey, locationId);
    if (contactId) {
      return contactId;
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      return NextResponse.json(
        { success: false, error: "API integration not configured" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as AuditCompanySyncRequest;
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: "Missing email" },
        { status: 400 },
      );
    }
    const existingContactId = await findExistingContactId(
      body.email,
      apiKey,
      locationId,
    );

    if (!existingContactId) {
      return NextResponse.json(
        { success: false, error: "Contact not found after form submission" },
        { status: 202 },
      );
    }

    const companyName = body.company_name.trim();
    const customFields = [];
    
    if (body.sms_consent !== undefined) {
      customFields.push({ id: GHL_FIELDS.SMS_CONSENT, value: parseConsent(body.sms_consent) });
    }
    if (body.marketing_consent !== undefined) {
      customFields.push({ id: GHL_FIELDS.MARKETING_CONSENT, value: parseConsent(body.marketing_consent) });
    }

    const res = await fetch(`${GHL_BASE}/contacts/${existingContactId}`, {
      method: "PUT",
      headers: ghlHeaders(apiKey),
      body: JSON.stringify({
        companyName,
        customFields: customFields.length > 0 ? customFields : undefined,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[GHL Contact Sync] Update failed:", res.status, errText);
      return NextResponse.json(
        { success: false, error: "Failed to sync contact" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      contactId: existingContactId,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
