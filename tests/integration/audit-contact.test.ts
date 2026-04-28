import { describe, it, expect, beforeAll, afterEach } from "vitest";
import {
  createTestContact,
  deleteContact,
  extractCustomField,
  FIELD_IDS,
  getContactById,
  makeTestEmail,
  pollContactCustomField,
  waitForContactIndexed,
} from "../support/ghl";

const BASE = `http://localhost:${process.env.TEST_PORT ?? 3100}`;
const RUN = process.env.RUN_GHL_TESTS === "1" || process.env.RUN_GHL_TESTS === "true";

describe.skipIf(!RUN)("POST /api/audit/contact — live GHL integration", () => {
  beforeAll(() => {
    if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
      throw new Error("GHL_API_KEY and GHL_LOCATION_ID must be set (check .env.local)");
    }
  });

  const cleanupIds: string[] = [];

  afterEach(async () => {
    while (cleanupIds.length) {
      const id = cleanupIds.pop()!;
      try {
        await deleteContact(id);
      } catch (err) {
        console.error(`cleanup failed for ${id}:`, err);
      }
    }
  });

  it("syncs companyName, source_industry, and marketing_consent onto an existing contact", async () => {
    const email = makeTestEmail();
    const { id: contactId } = await createTestContact({
      email,
      firstName: "Sync",
      lastName: "Tester",
    });
    cleanupIds.push(contactId);

    await waitForContactIndexed(email);

    const res = await fetch(`${BASE}/api/audit/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        company_name: "Sync Test Co",
        sms_consent: true,
        marketing_consent: false,
        source_industry: "real_estate",
      }),
    });
    expect(res.ok, `status ${res.status}`).toBe(true);
    const body = (await res.json()) as { success: boolean; contactId?: string };
    expect(body.success).toBe(true);
    expect(body.contactId).toBe(contactId);

    const companyHit = await pollContactCustomField(
      contactId,
      (c) => (c.companyName === "Sync Test Co" ? c.companyName : null),
      { timeoutMs: 15_000, intervalMs: 1_000 },
    );
    expect(companyHit, "companyName should be set on the contact").toBe("Sync Test Co");

    const industryHit = await pollContactCustomField(
      contactId,
      (c) => {
        const val = extractCustomField(c, FIELD_IDS.sourceIndustry);
        return val === "realestate" ? val : null;
      },
      { timeoutMs: 15_000, intervalMs: 1_000 },
    );
    expect(industryHit, "source_industry should normalize 'real_estate' → 'realestate'").toBe("realestate");

    const contact = await getContactById(contactId);
    const marketing = extractCustomField(contact, FIELD_IDS.marketingConsent);
    expect(marketing, "marketing_consent should be 'No'").toBe("No");
  }, 90_000);

  it("returns 202 when no contact is indexed for the email", async () => {
    const email = makeTestEmail();
    const res = await fetch(`${BASE}/api/audit/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        company_name: "Ghost Co",
        source_industry: "tech",
      }),
    });
    expect(res.status).toBe(202);
    const body = (await res.json()) as { success: boolean; error?: string };
    expect(body.success).toBe(false);
  }, 60_000);
});
