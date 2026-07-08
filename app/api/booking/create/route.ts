import { NextResponse } from "next/server";
import { INTEREST_SUBHEADINGS } from "@/lib/booking";
import { GHL_FIELDS, ghlHeaders, normalizeIndustry, parseConsent, tagContactInterest } from "@/lib/ghl";
import { CALENDAR_ID } from "@/lib/calendar";

const GHL_BASE = "https://services.leadconnectorhq.com";
const VALID_INTERESTS: Set<string> = new Set(Object.keys(INTEREST_SUBHEADINGS));

interface CreateBookingRequest {
  fullName: string;
  email: string;
  phone: string;
  slot: string;
  timezone: string;
  notes?: string;
  consent?: boolean;
  interest?: string;
  source?: string;
  industry?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmCampaign?: string;
  gclid?: string;
  fbclid?: string;
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.slice(0, spaceIndex),
    lastName: trimmed.slice(spaceIndex + 1),
  };
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

    const body = (await request.json()) as CreateBookingRequest;

    if (!body.fullName || !body.email || !body.phone || !body.slot || !body.timezone) {
      return NextResponse.json(
        { success: false, error: "Missing required booking fields" },
        { status: 400 },
      );
    }

    if (body.interest && !VALID_INTERESTS.has(body.interest)) {
      return NextResponse.json(
        { success: false, error: "Invalid interest value" },
        { status: 400 },
      );
    }

    const { firstName, lastName } = splitFullName(body.fullName);

    const customFields: { id: string; value: unknown }[] = [
      { id: GHL_FIELDS.SMS_CONSENT, value: parseConsent(body.consent) },
      { id: GHL_FIELDS.MARKETING_CONSENT, value: parseConsent(body.consent) },
    ];
    if (body.industry) {
      customFields.push({ id: GHL_FIELDS.SOURCE_INDUSTRY, value: normalizeIndustry(body.industry) });
    }

    // 1. Upsert contact
    const upsertRes = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: ghlHeaders(apiKey),
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email: body.email,
        phone: body.phone,
        timezone: body.timezone,
        source: "calendar",
        customFields,
        attributionSource: {
          utmSource: body.utmSource || "marketstack.ai",
          utmMedium: body.utmMedium || "website",
          utmContent: body.utmContent || body.interest || undefined,
          utmCampaign: body.utmCampaign || body.source || undefined,
          ...(body.gclid ? { gclid: body.gclid } : {}),
          ...(body.fbclid ? { fbclid: body.fbclid } : {}),
        },
      }),
    });

    if (!upsertRes.ok) {
      const errText = await upsertRes.text();
      console.error("[Booking Create] Contact upsert failed:", upsertRes.status, errText);
      return NextResponse.json(
        { success: false, error: "Failed to create contact" },
        { status: 502 },
      );
    }

    const upsertData = (await upsertRes.json()) as { contact?: { id: string } };
    const contactId = upsertData.contact?.id;

    if (!contactId) {
      console.error("[Booking Create] Contact upsert succeeded but contact id is missing:", upsertData);
      return NextResponse.json(
        { success: false, error: "Failed to retrieve contact" },
        { status: 502 },
      );
    }

    // 2. Append interest (multi-select, append-don't-clobber)
    if (body.interest) {
      const tagResult = await tagContactInterest(contactId, body.interest, apiKey);
      if (!tagResult.ok) {
        console.error("[Booking Create] Interest tagging failed:", tagResult.error);
      }
    }

    // 3. Create appointment
    const appointmentRes = await fetch(`${GHL_BASE}/calendars/events/appointments`, {
      method: "POST",
      headers: ghlHeaders(apiKey),
      body: JSON.stringify({
        calendarId: CALENDAR_ID,
        locationId,
        contactId,
        startTime: body.slot,
        timezone: body.timezone,
        appointmentStatus: "confirmed",
        toNotify: true,
        meetingLocationType: "gmeet",
      }),
    });

    if (!appointmentRes.ok) {
      const errText = await appointmentRes.text();
      console.error("[Booking Create] Appointment creation failed:", appointmentRes.status, errText);
      return NextResponse.json(
        { success: false, error: "Failed to create appointment" },
        { status: 502 },
      );
    }

    const appointmentData = (await appointmentRes.json()) as { id?: string; appointment?: { id: string } };
    const appointmentId = appointmentData.id ?? appointmentData.appointment?.id;

    if (!appointmentId) {
      console.error("[Booking Create] No appointment id in response:", appointmentData);
      return NextResponse.json(
        { success: false, error: "Appointment created but id missing" },
        { status: 502 },
      );
    }

    // 4. Attach note directly (replaces the widget's calendar_notes + workflow workaround)
    if (body.notes && body.notes.trim().length > 0) {
      const noteRes = await fetch(
        `${GHL_BASE}/calendars/appointments/${appointmentId}/notes`,
        {
          method: "POST",
          headers: ghlHeaders(apiKey),
          body: JSON.stringify({ body: `Booking Note: ${body.notes.trim()}` }),
        },
      );
      if (!noteRes.ok) {
        console.error("[Booking Create] Appointment note failed:", noteRes.status, await noteRes.text());
      }
    }

    return NextResponse.json({ success: true, appointmentId });
  } catch (error: unknown) {
    console.error("Booking create API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
