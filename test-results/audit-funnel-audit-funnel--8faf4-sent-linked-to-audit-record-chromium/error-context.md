# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: audit-funnel.spec.ts >> audit funnel — end-to-end via GHL tracker >> single contact is captured with company + consent, linked to audit record
- Location: tests\e2e\audit-funnel.spec.ts:24:7

# Error details

```
Error: audit custom-object record should be associated with contact

expect(received).toBeTruthy()

Received: null
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]:
        - img [ref=e16]
        - generic [ref=e18]: Audit Complete
      - generic [ref=e19]:
        - heading "Estimated Monthly Revenue at Risk" [level=1] [ref=e20]
        - generic [ref=e23]: $180,000
        - paragraph [ref=e24]:
          - text: That's up to
          - strong [ref=e25]: $2,160,000
          - text: per year if every missed lead had converted.
        - generic [ref=e26]:
          - generic [ref=e27]: "Conservative: $115,500/mo"
          - generic [ref=e28]: "|"
          - generic [ref=e29]: "Optimistic: $253,500/mo"
        - generic [ref=e31]:
          - text: "With Close Rate Factor:"
          - generic [ref=e32]: $45,000/mo
          - generic [ref=e33]: ($540,000/yr)
    - generic [ref=e34]:
      - heading "Adjust Results" [level=3] [ref=e37]:
        - button "Adjust Results" [ref=e38] [cursor=pointer]:
          - generic [ref=e39]: Adjust Results
          - img [ref=e40]
      - generic [ref=e42]:
        - generic [ref=e43] [cursor=pointer]:
          - generic [ref=e44]:
            - img [ref=e45]
            - button "More info" [ref=e49]:
              - img [ref=e50]
              - generic [ref=e52]: More info
          - paragraph [ref=e53]: Leads/mo
          - paragraph [ref=e55]: "50"
        - generic [ref=e56] [cursor=pointer]:
          - generic [ref=e57]:
            - img [ref=e58]
            - button "More info" [ref=e61]:
              - img [ref=e62]
              - generic [ref=e64]: More info
          - paragraph [ref=e65]: Leak Rate
          - paragraph [ref=e67]: 60%
        - generic [ref=e68] [cursor=pointer]:
          - generic [ref=e69]:
            - img [ref=e70]
            - button "More info" [ref=e72]:
              - img [ref=e73]
              - generic [ref=e75]: More info
          - paragraph [ref=e76]: Close Rate
          - paragraph [ref=e78]: 25%
        - generic [ref=e79] [cursor=pointer]:
          - generic [ref=e80]:
            - img [ref=e81]
            - button "More info" [ref=e83]:
              - img [ref=e84]
              - generic [ref=e86]: More info
          - paragraph [ref=e87]: Avg Job Value
          - paragraph [ref=e89]: $6,000
    - generic [ref=e92]:
      - generic [ref=e93]:
        - heading "Growth Stage" [level=3] [ref=e94]:
          - generic [ref=e95]: Growth Stage
        - paragraph [ref=e96]: Your volume is outstripping your infrastructure. Automation isn't optional anymore — it's the difference between scaling and stalling.
      - generic [ref=e98]:
        - generic [ref=e100]: Strategic Goal
        - paragraph [ref=e101]: Leverage automation to scale lead handling capacity without increasing administrative overhead.
    - generic [ref=e104]:
      - generic [ref=e105]:
        - generic [ref=e106]: AI Readiness
        - generic [ref=e107]: Moderate
      - generic [ref=e108]:
        - generic [ref=e111]: Low
        - generic [ref=e115]: Moderate
        - generic [ref=e119]: High
      - paragraph [ref=e120]: Infrastructure is scaling and your team has the mindset to introduce conversational AI.
      - generic [ref=e121]:
        - paragraph [ref=e122]: What this means for you
        - list [ref=e123]:
          - listitem [ref=e124]: Your infrastructure supports AI-assisted follow-up and intake workflows.
          - listitem [ref=e126]: Start with conversational AI for intake — highest leverage, lowest risk.
          - listitem [ref=e128]: Avoid over-engineering; targeted automation will outperform broad AI rollouts.
    - generic [ref=e130]:
      - heading "Your Top Quick Wins" [level=2] [ref=e131]
      - paragraph [ref=e132]: Based on your answers, these are the highest-impact actions you can take right now — ranked by potential revenue recovered.
      - generic [ref=e133]:
        - generic [ref=e134]:
          - separator [ref=e135]
          - generic [ref=e137]:
            - generic [ref=e138]:
              - img [ref=e139]
              - text: Recommended Stack
            - heading "Operating System" [level=3] [ref=e141]
            - paragraph [ref=e142]: Our core revenue infrastructure. Fully automated lead response, custom CRM workflows, and professional website deployment.
          - generic [ref=e143]:
            - paragraph [ref=e144]: Projected Impact
            - text: Professional scale. Every lead is captured, nurtured, and tracked automatically.
          - generic [ref=e145]:
            - generic [ref=e146]:
              - img [ref=e147]
              - generic [ref=e149]: $4,500
            - generic [ref=e150]:
              - img [ref=e151]
              - generic [ref=e154]: 2 Weeks
          - link "Book Your OS Setup" [ref=e155] [cursor=pointer]:
            - /url: /book
            - text: Book Your OS Setup
            - img [ref=e156]
        - generic [ref=e160]:
          - generic [ref=e162]:
            - heading "AI Receptionist" [level=3] [ref=e163]
            - paragraph [ref=e164]: 24/7 conversational AI that answers calls, qualifies leads, and books appointments. Trained on your business — every missed call becomes an opportunity.
          - generic [ref=e165]:
            - paragraph [ref=e166]: Projected Impact
            - text: Based on your ~50 leads/mo and 60% leak rate, this could recover ~15 of 30 leaked leads/mo. At $6,000 avg job value and 25% close rate, that's ~$22,500/mo in recovered revenue.
          - generic [ref=e167]:
            - generic [ref=e168]:
              - img [ref=e169]
              - generic [ref=e171]: $2,500 – $4,000
            - generic [ref=e172]:
              - img [ref=e173]
              - generic [ref=e176]: 2–3 weeks
          - link "Learn About AI Receptionists" [ref=e177] [cursor=pointer]:
            - /url: /book
            - text: Learn About AI Receptionists
            - img [ref=e178]
        - generic [ref=e182]:
          - generic [ref=e184]:
            - heading "Custom Workflow Automation" [level=3] [ref=e185]
            - paragraph [ref=e186]: One high-impact automated workflow — estimate follow-up, job status notifications, vendor coordination, or scheduling. Eliminates the manual bottleneck.
          - generic [ref=e187]:
            - paragraph [ref=e188]: Projected Impact
            - text: Based on your ~50 leads/mo and 60% leak rate, this could recover ~9 of 30 leaked leads/mo. At $6,000 avg job value and 25% close rate, that's ~$13,500/mo in recovered revenue.
          - generic [ref=e189]:
            - generic [ref=e190]:
              - img [ref=e191]
              - generic [ref=e193]: $3,000 – $7,000
            - generic [ref=e194]:
              - img [ref=e195]
              - generic [ref=e198]: 2–4 weeks
          - link "Scope Your Workflow" [ref=e199] [cursor=pointer]:
            - /url: /book
            - text: Scope Your Workflow
            - img [ref=e200]
    - generic [ref=e203]:
      - link "Book Your Operating System Call" [ref=e204] [cursor=pointer]:
        - /url: /book
        - text: Book Your Operating System Call
        - img [ref=e205]
      - generic [ref=e207]:
        - link "View Your Recommended Stack" [ref=e208] [cursor=pointer]:
          - /url: /services#stack
        - link "Book a Paid Audit — $500 credit toward a project" [ref=e209] [cursor=pointer]:
          - /url: /book
      - paragraph [ref=e210]: Your results are saved. We'll be in touch at test+audit-1776953881594-9951@marketstack.ai.
      - button "Start Over" [ref=e211] [cursor=pointer]
```

# Test source

```ts
  19  |     if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
  20  |       throw new Error("GHL_API_KEY and GHL_LOCATION_ID must be set (check .env.local)");
  21  |     }
  22  |   });
  23  | 
  24  |   test("single contact is captured with company + consent, linked to audit record", async ({ page }) => {
  25  |     const email = makeTestEmail();
  26  |     const businessName = "E2E Test Inc";
  27  |     const cleanupIds: string[] = [];
  28  | 
  29  |     try {
  30  |       await page.addInitScript(() => {
  31  |         window.localStorage.setItem("ms_ghl_enabled", "true");
  32  |       });
  33  | 
  34  |       await page.goto("/audit/start");
  35  |       await page.waitForLoadState("domcontentloaded");
  36  | 
  37  |       const startBtn = page.getByRole("button", { name: /start the audit/i });
  38  |       if (await startBtn.isVisible().catch(() => false)) {
  39  |         await startBtn.click();
  40  |       }
  41  | 
  42  |       await page.locator('input[name="first_name"]').fill("E2E");
  43  |       await page.locator('input[name="last_name"]').fill("Tester");
  44  |       await page.locator('input[name="company_name"]').fill(businessName);
  45  |       await page.locator('input[name="website"]').fill("https://example.com");
  46  |       await page.locator('input[name="email"]').fill(email);
  47  |       await page.locator('input[name="phone"]').fill("5551234567");
  48  | 
  49  |       // Visible SMS/marketing checkboxes live inside a <form name="contact"> (tracker-observed).
  50  |       // First checkbox = SMS, second = marketing. Only check SMS.
  51  |       const visibleCheckboxes = page.locator('form[name="contact"] input[type=checkbox]');
  52  |       await visibleCheckboxes.nth(0).check();
  53  | 
  54  |       await page.getByRole("button", { name: /^next$/i }).click();
  55  | 
  56  |       await page.waitForURL(/\/audit(\?.*)?$/, { timeout: 15_000 });
  57  |       await page.waitForLoadState("domcontentloaded");
  58  | 
  59  |       await page.waitForFunction(() => window.location.pathname === "/audit", null, {
  60  |         timeout: 15_000,
  61  |       });
  62  | 
  63  |       // Give the GHL tracker a moment to kick off contact creation before auto-submitting.
  64  |       // Both /api/audit/contact and /api/audit/complete now retry for ~20s, so we don't need
  65  |       // a long deterministic wait here.
  66  |       await page.waitForTimeout(3_000);
  67  | 
  68  |       await page.evaluate(() => {
  69  |         const autoSubmit = Array.from(document.querySelectorAll("button")).find(
  70  |           (b) => b.textContent?.trim().toLowerCase() === "auto submit",
  71  |         ) as HTMLButtonElement | undefined;
  72  |         if (autoSubmit) autoSubmit.click();
  73  |       });
  74  | 
  75  |       await page.waitForURL(/\/audit\/report/, { timeout: 45_000 });
  76  | 
  77  |       let contacts = await getAllContactsByEmail(email);
  78  |       const startTime = Date.now();
  79  |       while (contacts.length === 0 && Date.now() - startTime < 30_000) {
  80  |         await new Promise((r) => setTimeout(r, 1500));
  81  |         contacts = await getAllContactsByEmail(email);
  82  |       }
  83  |       expect(contacts.length, "GHL tracker must create the contact").toBeGreaterThan(0);
  84  | 
  85  |       for (const c of contacts) cleanupIds.push(c.id);
  86  | 
  87  |       expect(
  88  |         contacts.length,
  89  |         `expected exactly one contact for ${email}, got ${contacts.length}: ${contacts.map((c) => c.id).join(", ")}`,
  90  |       ).toBe(1);
  91  | 
  92  |       const contactId = contacts[0].id;
  93  | 
  94  |       const companyResult = await pollContactCustomField(
  95  |         contactId,
  96  |         (c) => (c.companyName ? c.companyName : null),
  97  |         { timeoutMs: 30_000, intervalMs: 1_500 },
  98  |       );
  99  |       expect(companyResult, "companyName should be populated on the contact").toBe(businessName);
  100 | 
  101 |       const fullContact = await getContactById(contactId);
  102 | 
  103 |       // GHL workflow routes sms_consent → dndSettings.SMS (not a custom field).
  104 |       // "inactive" = DND off = user consented; "active" = DND on = user declined.
  105 |       expect(
  106 |         fullContact.dndSettings?.SMS?.status,
  107 |         "dndSettings.SMS should be 'inactive' when SMS consent was checked",
  108 |       ).toBe("inactive");
  109 | 
  110 |       // marketing_consent stays as a custom field (no DND workflow for marketing).
  111 |       const marketing = extractCustomField(fullContact, FIELD_IDS.marketingConsent);
  112 |       expect(marketing, "marketing_consent custom field should be 'No' (box unchecked)").toBe("No");
  113 | 
  114 |       const record = await pollAssociatedAuditRecord(
  115 |         contactId,
  116 |         (r) => typeof r.properties?.team_size === "number",
  117 |         { timeoutMs: 30_000, intervalMs: 1_500 },
  118 |       );
> 119 |       expect(record, "audit custom-object record should be associated with contact").toBeTruthy();
      |                                                                                      ^ Error: audit custom-object record should be associated with contact
  120 |       if (record) {
  121 |         expect(record.properties.team_size).toBe(12);
  122 |         expect(record.properties.monthly_revenue).toBe(175000);
  123 |         expect(Array.isArray(record.properties.biggest_challenges)).toBe(true);
  124 |       }
  125 | 
  126 |       const recommendation = extractCustomField(fullContact, FIELD_IDS.recommendation);
  127 |       expect(recommendation, "recommendation should be set").toBeTruthy();
  128 |     } finally {
  129 |       for (const id of cleanupIds) {
  130 |         try {
  131 |           await deleteContact(id);
  132 |         } catch (err) {
  133 |           console.error(`cleanup failed for ${id}:`, err);
  134 |         }
  135 |       }
  136 |     }
  137 |   });
  138 | });
  139 | 
```