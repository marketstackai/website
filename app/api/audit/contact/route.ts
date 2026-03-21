import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, customField } = body;
    
    // Check for existing contact ID in cookies
    const cookieHeader = request.headers.get("cookie");
    const match = cookieHeader?.match(/ms_audit_cid=([^;]+)/);
    const existingContactId = match ? match[1] : null;

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      console.warn("Missing GHL API credentials - bypassing actual API call");
      // For development/testing without real keys, simulate success
      const fakeId = "mock_contact_id_" + Date.now();
      const response = NextResponse.json({ success: true, contact_id: existingContactId || fakeId });
      if (!existingContactId) {
        response.cookies.set("ms_audit_cid", fakeId, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
      }
      return response;
    }

    const endpoint = existingContactId 
      ? `https://services.leadconnectorhq.com/contacts/${existingContactId}` 
      : `https://services.leadconnectorhq.com/contacts/`;
    
    const method = existingContactId ? "PUT" : "POST";

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      locationId,
      tags: ["audit_started"],
      customFields: customField ? Object.entries(customField).map(([key, value]) => ({
        id: key,
        field_value: value
      })) : []
    };

    const ghlResponse = await fetch(endpoint, {
      method,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!ghlResponse.ok) {
      const errorText = await ghlResponse.text();
      throw new Error(`GHL API error: ${ghlResponse.status} - ${errorText}`);
    }

    const data = await ghlResponse.json();
    const contactId = data.contact?.id || existingContactId;

    const response = NextResponse.json({ success: true, contact_id: contactId });
    if (!existingContactId && contactId) {
      // Create new cookie if we created a new contact
      response.cookies.set("ms_audit_cid", contactId, { maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
    }

    return response;

  } catch (error: unknown) {
    console.error("Audit Contact API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
