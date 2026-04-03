import { NextRequest, NextResponse } from "next/server";

const GHL_BASE = "https://services.leadconnectorhq.com";

async function getContactEmail(
  contactId: string,
  apiKey: string,
): Promise<string> {
  const res = await fetch(`${GHL_BASE}/contacts/${contactId}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
    },
  });
  if (!res.ok) return "";
  const data = await res.json();
  return data.contact?.email ?? "";
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing record id" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GHL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API not configured" },
        { status: 503 },
      );
    }

    const locationId = process.env.GHL_LOCATION_ID;
    if (!locationId) {
      return NextResponse.json(
        { success: false, error: "API not configured" },
        { status: 503 },
      );
    }

    const res = await fetch(
      `${GHL_BASE}/objects/custom_objects.audit/records/${id}?locationId=${locationId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
        },
      },
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { success: false, error: "Report not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { success: false, error: "Failed to fetch report" },
        { status: res.status },
      );
    }

    const data = await res.json();
    const props = data.record?.properties ?? {};

    // Reconstruct quiz data from stored properties
    const quizData = {
      industry: props.industry ?? "",
      industry_other: props.industry_other ?? "",
      team_size: String(props.team_size ?? ""),
      monthly_revenue: String(props.monthly_revenue ?? ""),
      avg_job_value: String(props.avg_job_value ?? ""),
      monthly_leads: String(props.monthly_leads ?? ""),
      biggest_challenges: Array.isArray(props.biggest_challenges)
        ? props.biggest_challenges
        : props.biggest_challenges
          ? String(props.biggest_challenges).split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
      lead_response: props.lead_response ?? "",
      ai_experience: props.ai_experience ?? "",
      ai_detail: props.ai_detail ?? "",
      urgency: props.urgency ?? "",
      additional_notes: props.additional_notes ?? "",
    };

    // Get contact email from the association
    let email = "";
    const associations = await fetch(
      `${GHL_BASE}/associations/?locationId=${locationId}&objectKey=custom_objects.audit&recordId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Version: "2021-07-28",
        },
      },
    );
    if (associations.ok) {
      const assocData = await associations.json();
      const contactAssoc = assocData.associations?.find(
        (a: { objectKey: string; recordId: string }) => a.objectKey === "contact",
      );
      if (contactAssoc?.recordId) {
        email = await getContactEmail(contactAssoc.recordId, apiKey);
      }
    }

    return NextResponse.json({
      success: true,
      quizData,
      email,
    });
  } catch (error: unknown) {
    console.error("Audit Report API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
