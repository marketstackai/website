import { NextResponse } from "next/server";
import { INTEREST_SUBHEADINGS } from "@/lib/booking";
import { GHL_FIELDS, normalizeIndustry } from "@/lib/ghl";

const GHL_BASE = "https://services.leadconnectorhq.com";


const VALID_INTERESTS: Set<string> = new Set(Object.keys(INTEREST_SUBHEADINGS));

interface GHLContact {
  id: string;
  customFields?: { id: string; value: unknown }[];
}

function ghlHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  } as const;
}

export async function POST(request: Request) {
  try {
    const { contactId, interest, source_industry } = (await request.json()) as {
      contactId?: string;
      interest?: string;
      source_industry?: string;
    };

    if (!contactId || !interest) {
      return NextResponse.json(
        { success: false, error: "Missing contactId or interest" },
        { status: 400 },
      );
    }

    if (!VALID_INTERESTS.has(interest)) {
      return NextResponse.json(
        { success: false, error: "Invalid interest value" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      return NextResponse.json(
        { success: false, error: "API integration not configured" },
        { status: 503 },
      );
    }

    // 1. Read current contact to get existing interests
    const getRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      headers: ghlHeaders(apiKey),
    });

    if (!getRes.ok) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 },
      );
    }

    const { contact } = (await getRes.json()) as { contact: GHLContact };

    // 2. Read current interests and append if not already present
    const existingField = contact.customFields?.find(
      (f) => f.id === GHL_FIELDS.INTERESTS,
    );
    const currentInterests: string[] = Array.isArray(existingField?.value)
      ? (existingField.value as string[])
      : [];

    if (currentInterests.includes(interest)) {
      return NextResponse.json({ success: true, updated: false });
    }

    // 3. Write merged interests back
    const updateRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      method: "PUT",
      headers: ghlHeaders(apiKey),
      body: JSON.stringify({
        customFields: [
          { id: GHL_FIELDS.INTERESTS, value: [...currentInterests, interest] },
          ...(source_industry && GHL_FIELDS.SOURCE_INDUSTRY
            ? [{ id: GHL_FIELDS.SOURCE_INDUSTRY, value: normalizeIndustry(source_industry) }]
            : []),
        ],
      }),
    });

    if (!updateRes.ok) {
      console.error(
        "Failed to update interests:",
        updateRes.status,
        await updateRes.text(),
      );
      return NextResponse.json(
        { success: false, error: "Failed to update contact" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, updated: true });
  } catch (error: unknown) {
    console.error("Booking interest API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
