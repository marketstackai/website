import { NextResponse } from "next/server";
import { ghlHeaders } from "@/lib/ghl";
import { CALENDAR_ID, clampAvailabilityRange } from "@/lib/calendar";

const GHL_BASE = "https://services.leadconnectorhq.com";

interface GHLFreeSlotsResponse {
  [dateKey: string]: { slots: string[] } | string | undefined;
  traceId?: string;
}

export async function GET(request: Request) {
  try {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      return NextResponse.json(
        { success: false, error: "API integration not configured" },
        { status: 503 },
      );
    }

    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get("startDate");
    const endParam = searchParams.get("endDate");
    const timezone = searchParams.get("timezone");

    if (!startParam || !endParam || !timezone) {
      return NextResponse.json(
        { success: false, error: "Missing startDate, endDate, or timezone" },
        { status: 400 },
      );
    }

    const { startDate, endDate } = clampAvailabilityRange(
      Number(startParam),
      Number(endParam),
    );

    const params = new URLSearchParams({
      startDate: String(startDate),
      endDate: String(endDate),
      timezone,
    });

    const res = await fetch(
      `${GHL_BASE}/calendars/${CALENDAR_ID}/free-slots?${params}`,
      { headers: ghlHeaders(apiKey) },
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch availability" },
        { status: 502 },
      );
    }

    const data = (await res.json()) as GHLFreeSlotsResponse;

    const slotsByDate: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === "traceId" || typeof value !== "object" || value === null) continue;
      slotsByDate[key] = value.slots ?? [];
    }

    return NextResponse.json({ success: true, slots: slotsByDate });
  } catch (error: unknown) {
    console.error("Booking slots API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
