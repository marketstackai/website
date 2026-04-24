import { describe, it, expect, beforeAll, afterEach } from "vitest";
import {
  createTestContact,
  deleteContact,
  extractCustomField,
  FIELD_IDS,
  getContactById,
  makeTestEmail,
  pollAssociatedAuditRecord,
  pollContactCustomField,
  waitForContactIndexed,
} from "../support/ghl";

const BASE = `http://localhost:${process.env.TEST_PORT ?? 3100}`;
const RUN = process.env.RUN_GHL_TESTS === "1" || process.env.RUN_GHL_TESTS === "true";

describe.skipIf(!RUN)("POST /api/audit/complete — live GHL integration", () => {
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

  it("updates an existing contact: tags, recommendation custom field, audit record + association", async () => {
    const email = makeTestEmail();
    const { id: contactId } = await createTestContact({
      email,
      firstName: "Test",
      lastName: "Integration",
      phone: "",
      companyName: "Integration Test Co",
      website: "https://example.com",
      smsConsent: true,
      marketingConsent: false,
    });
    cleanupIds.push(contactId);

    await waitForContactIndexed(email);

    const payload = {
      email,
      full_name: "Test Integration",
      company_name: "Integration Test Co",
      contact_updates: {
        tags_add: ["hot", "high ticket"],
        customField: { recommended: "Studio" },
      },
      audit_record: {
        website: "https://example.com",
        industry: "other",
        industry_other: "Magician",
        team_size: "12",
        monthly_revenue: "175000",
        avg_job_value: "6000",
        monthly_leads: "50",
        biggest_challenges: ["missed_leads", "manual_tasks"],
        lead_response: "voicemail",
        ai_experience: "ai_some_results",
        ai_detail: "Test detail",
        urgency: "urgent",
        additional_notes: "Test run from vitest integration suite",
        recommended: "studio",
      },
      computed_email: {
        firstName: "Test",
        tierLabel: "Growth",
        totalScore: 72,
        realisticMonthly: 40000,
        realisticAnnual: 480000,
        recommendedPackage: "Studio",
        aiReadinessScore: 70,
        aiReadinessDescription: "Intermediate",
        leads: 50,
        leakRate: 0.4,
        quickWins: [{ title: "Lead recovery", recoveredMonthly: 15000 }],
      },
    };

    const res = await fetch(`${BASE}/api/audit/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(res.ok, `status ${res.status}`).toBe(true);
    const body = (await res.json()) as { success: boolean; recordId?: string | null };
    expect(body.success).toBe(true);
    expect(body.recordId, "route should return the created record id").toBeTruthy();

    const recCheck = await pollContactCustomField(
      contactId,
      (c) => {
        const rec = extractCustomField(c, FIELD_IDS.recommendation);
        return rec === "Studio" ? rec : null;
      },
      { timeoutMs: 15_000, intervalMs: 1_000 },
    );
    expect(recCheck, "recommendation custom field should be 'Studio'").toBe("Studio");

    const contact = await getContactById(contactId);
    expect(contact.tags, "should have 'hot' tag").toContain("hot");
    expect(contact.tags, "should have 'high ticket' tag").toContain("high ticket");
    expect(contact.tags, "should still have 'test' tag").toContain("test");

    const auditRecord = await pollAssociatedAuditRecord(
      contactId,
      (r) => r.properties?.industry === "other",
      { timeoutMs: 20_000, intervalMs: 1_000 },
    );
    expect(auditRecord, "audit record must be associated with contact").toBeTruthy();
    if (auditRecord) {
      expect(auditRecord.properties.industry).toBe("other");
      expect(auditRecord.properties.team_size).toBe(12);
      expect(auditRecord.properties.monthly_revenue).toBe(175000);
      expect(Array.isArray(auditRecord.properties.biggest_challenges)).toBe(true);
      expect(auditRecord.properties.biggest_challenges).toEqual(
        expect.arrayContaining(["missed_leads", "manual_tasks"]),
      );
      expect(auditRecord.properties.recommended).toBe("studio");
    }
  }, 90_000);

  it("returns success (no-op) when email does not match any GHL contact", async () => {
    const email = makeTestEmail();
    const res = await fetch(`${BASE}/api/audit/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        full_name: "Ghost User",
        company_name: "Ghost Co",
        contact_updates: { tags_add: ["hot"], customField: { recommended: "Studio" } },
        audit_record: {},
        computed_email: null,
      }),
    });
    expect(res.ok).toBe(true);
    const body = (await res.json()) as { success: boolean; recordId?: string | null };
    expect(body.success).toBe(true);
    expect(body.recordId ?? null).toBeNull();
  }, 45_000);
});
