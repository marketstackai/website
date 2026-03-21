import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact_id, contact_updates, stack_audit_record } = body;

    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      console.warn("Missing GHL API credentials - skipping real API calls");
      return NextResponse.json({ success: true });
    }

    if (!contact_id) {
       return NextResponse.json({ success: false, error: "Missing contact_id" }, { status: 400 });
    }

    // 1. Update Contact
    if (contact_updates) {
      const tagsToAdd = contact_updates.tags_add || [];
      if (tagsToAdd.length > 0) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contact_id}/tags`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tags: tagsToAdd }),
        });
      }

      const tagsToRemove = contact_updates.tags_remove || [];
      if (tagsToRemove.length > 0) {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contact_id}/tags`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Version": "2021-07-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tags: tagsToRemove }),
        });
      }

      if (contact_updates.customField) {
         await fetch(`https://services.leadconnectorhq.com/contacts/${contact_id}`, {
            method: "PUT",
            headers: {
               "Authorization": `Bearer ${apiKey}`,
               "Version": "2021-07-28",
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               customFields: Object.entries(contact_updates.customField).map(([key, value]) => ({
                 id: key,
                 field_value: value
               }))
            }),
         });
      }
    }

    // 2. Create Stack Audit Custom Object Record
    if (stack_audit_record) {
      const customObjectPayload = {
        contactId: contact_id,
        locationId,
        customObjectTemplateId: "stack_audit", // The exact ID will be used once established in GHL account
        name: `Stack Audit - ${new Date().toISOString()}`,
        properties: stack_audit_record
      };

      await fetch(`https://services.leadconnectorhq.com/custom-objects/records`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customObjectPayload),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Audit Complete API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
