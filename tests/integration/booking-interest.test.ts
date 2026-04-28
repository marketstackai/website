import { describe, it, expect, beforeAll, afterEach } from "vitest";
import {
  createTestContact,
  deleteContact,
  extractCustomField,
  FIELD_IDS,
  getContactById,
  makeTestEmail,
  pollContactCustomField,
} from "../support/ghl";

const BASE = `http://localhost:${process.env.TEST_PORT ?? 3100}`;
const RUN = process.env.RUN_GHL_TESTS === "1" || process.env.RUN_GHL_TESTS === "true";

describe.skipIf(!RUN)("POST /api/booking/interest — live GHL integration", () => {
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

  it("appends the interest, merges duplicates, and writes source_industry alongside", async () => {
    const email = makeTestEmail();
    const { id: contactId } = await createTestContact({
      email,
      firstName: "Interest",
      lastName: "Tester",
    });
    cleanupIds.push(contactId);

    const first = await fetch(`${BASE}/api/booking/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, interest: "studio", source_industry: "ecom" }),
    });
    expect(first.ok, `first status ${first.status}`).toBe(true);
    const firstBody = (await first.json()) as { success: boolean; updated?: boolean };
    expect(firstBody.updated).toBe(true);

    const studioHit = await pollContactCustomField(
      contactId,
      (c) => {
        const val = extractCustomField(c, FIELD_IDS.interests);
        return Array.isArray(val) && val.includes("studio") ? val : null;
      },
      { timeoutMs: 15_000, intervalMs: 1_000 },
    );
    expect(studioHit, "interests should contain 'studio' after first POST").toBeTruthy();

    const industryHit = await pollContactCustomField(
      contactId,
      (c) => {
        const val = extractCustomField(c, FIELD_IDS.sourceIndustry);
        return val === "ecommerce" ? val : null;
      },
      { timeoutMs: 15_000, intervalMs: 1_000 },
    );
    expect(industryHit, "source_industry should normalize 'ecom' → 'ecommerce'").toBe("ecommerce");

    // Second post: different interest. Should merge, not replace.
    const second = await fetch(`${BASE}/api/booking/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, interest: "kit" }),
    });
    expect(second.ok, `second status ${second.status}`).toBe(true);

    const merged = await pollContactCustomField(
      contactId,
      (c) => {
        const val = extractCustomField(c, FIELD_IDS.interests);
        return Array.isArray(val) && val.includes("studio") && val.includes("kit") ? val : null;
      },
      { timeoutMs: 15_000, intervalMs: 1_000 },
    );
    expect(merged, "interests should contain both 'studio' and 'kit' after second POST").toBeTruthy();

    // Third post: same as first. Should no-op (updated: false).
    const third = await fetch(`${BASE}/api/booking/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, interest: "studio" }),
    });
    expect(third.ok).toBe(true);
    const thirdBody = (await third.json()) as { success: boolean; updated?: boolean };
    expect(thirdBody.updated, "duplicate interest should report updated:false").toBe(false);

    const finalContact = await getContactById(contactId);
    const finalInterests = extractCustomField(finalContact, FIELD_IDS.interests);
    expect(Array.isArray(finalInterests)).toBe(true);
    if (Array.isArray(finalInterests)) {
      const studios = finalInterests.filter((v) => v === "studio").length;
      expect(studios, "'studio' must appear exactly once even after duplicate POST").toBe(1);
    }
  }, 90_000);

  it("rejects an unknown interest with 400", async () => {
    const email = makeTestEmail();
    const { id: contactId } = await createTestContact({
      email,
      firstName: "Bad",
      lastName: "Interest",
    });
    cleanupIds.push(contactId);

    const res = await fetch(`${BASE}/api/booking/interest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, interest: "not_a_real_interest" }),
    });
    expect(res.status).toBe(400);
  }, 30_000);
});
