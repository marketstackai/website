import { test, expect } from "@playwright/test";
import {
  deleteContact,
  extractCustomField,
  FIELD_IDS,
  getAllContactsByEmail,
  getContactById,
  makeTestEmail,
  pollAssociatedAuditRecord,
  pollContactCustomField,
} from "../support/ghl";

const RUN = process.env.RUN_GHL_TESTS === "1" || process.env.RUN_GHL_TESTS === "true";

test.describe("audit funnel — end-to-end via GHL tracker", () => {
  test.skip(!RUN, "RUN_GHL_TESTS not set");

  test.beforeAll(() => {
    if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
      throw new Error("GHL_API_KEY and GHL_LOCATION_ID must be set (check .env.local)");
    }
  });

  test("single contact is captured with company + consent, linked to audit record", async ({ page }) => {
    const email = makeTestEmail();
    const businessName = "E2E Test Inc";
    const cleanupIds: string[] = [];

    try {
      await page.addInitScript(() => {
        window.localStorage.setItem("ms_ghl_enabled", "true");
      });

      await page.goto("/audit/start");
      await page.waitForLoadState("domcontentloaded");

      const startBtn = page.getByRole("button", { name: /start the audit/i });
      if (await startBtn.isVisible().catch(() => false)) {
        await startBtn.click();
      }

      await page.locator('input[name="first_name"]').fill("E2E");
      await page.locator('input[name="last_name"]').fill("Tester");
      await page.locator('input[name="company_name"]').fill(businessName);
      await page.locator('input[name="website"]').fill("https://example.com");
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="phone"]').fill("5551234567");

      // Visible SMS/marketing checkboxes live inside a <form name="contact"> (tracker-observed).
      // First checkbox = SMS, second = marketing. Only check SMS.
      const visibleCheckboxes = page.locator('form[name="contact"] input[type=checkbox]');
      await visibleCheckboxes.nth(0).check();

      await page.getByRole("button", { name: /^next$/i }).click();

      await page.waitForURL(/\/audit(\?.*)?$/, { timeout: 15_000 });
      await page.waitForLoadState("domcontentloaded");

      await page.waitForFunction(() => window.location.pathname === "/audit", null, {
        timeout: 15_000,
      });

      // Give the GHL tracker a moment to kick off contact creation before auto-submitting.
      // Both /api/audit/contact and /api/audit/complete now retry for ~20s, so we don't need
      // a long deterministic wait here.
      await page.waitForTimeout(3_000);

      await page.evaluate(() => {
        const autoSubmit = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.trim().toLowerCase() === "auto submit",
        ) as HTMLButtonElement | undefined;
        if (autoSubmit) autoSubmit.click();
      });

      await page.waitForURL(/\/audit\/report/, { timeout: 45_000 });

      let contacts = await getAllContactsByEmail(email);
      const startTime = Date.now();
      while (contacts.length === 0 && Date.now() - startTime < 30_000) {
        await new Promise((r) => setTimeout(r, 1500));
        contacts = await getAllContactsByEmail(email);
      }
      expect(contacts.length, "GHL tracker must create the contact").toBeGreaterThan(0);

      for (const c of contacts) cleanupIds.push(c.id);

      expect(
        contacts.length,
        `expected exactly one contact for ${email}, got ${contacts.length}: ${contacts.map((c) => c.id).join(", ")}`,
      ).toBe(1);

      const contactId = contacts[0].id;

      const companyResult = await pollContactCustomField(
        contactId,
        (c) => (c.companyName ? c.companyName : null),
        { timeoutMs: 30_000, intervalMs: 1_500 },
      );
      expect(companyResult, "companyName should be populated on the contact").toBe(businessName);

      const fullContact = await getContactById(contactId);

      // GHL workflow routes sms_consent → dndSettings.SMS (not a custom field).
      // "inactive" = DND off = user consented; "active" = DND on = user declined.
      expect(
        fullContact.dndSettings?.SMS?.status,
        "dndSettings.SMS should be 'inactive' when SMS consent was checked",
      ).toBe("inactive");

      // marketing_consent stays as a custom field (no DND workflow for marketing).
      const marketing = extractCustomField(fullContact, FIELD_IDS.marketingConsent);
      expect(marketing, "marketing_consent custom field should be 'No' (box unchecked)").toBe("No");

      const record = await pollAssociatedAuditRecord(
        contactId,
        (r) => typeof r.properties?.team_size === "number",
        { timeoutMs: 30_000, intervalMs: 1_500 },
      );
      expect(record, "audit custom-object record should be associated with contact").toBeTruthy();
      if (record) {
        expect(record.properties.team_size).toBe(12);
        expect(record.properties.monthly_revenue).toBe(175000);
        expect(Array.isArray(record.properties.biggest_challenges)).toBe(true);
      }

      const recommendation = extractCustomField(fullContact, FIELD_IDS.recommendation);
      expect(recommendation, "recommendation should be set").toBeTruthy();
    } finally {
      for (const id of cleanupIds) {
        try {
          await deleteContact(id);
        } catch (err) {
          console.error(`cleanup failed for ${id}:`, err);
        }
      }
    }
  });
});
