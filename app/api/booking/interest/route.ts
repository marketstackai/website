import { NextResponse } from "next/server";
import { INTEREST_SUBHEADINGS } from "@/lib/booking";
import { tagContactInterest } from "@/lib/ghl";

const VALID_INTERESTS: Set<string> = new Set(Object.keys(INTEREST_SUBHEADINGS));

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

    const result = await tagContactInterest(contactId, interest, apiKey, source_industry);

    if (!result.ok) {
      console.error("Failed to update interests:", result.error);
      return NextResponse.json(
        { success: false, error: result.error === "Contact not found" ? result.error : "Failed to update contact" },
        { status: result.error === "Contact not found" ? 404 : 502 },
      );
    }

    return NextResponse.json({ success: true, updated: result.updated });
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
