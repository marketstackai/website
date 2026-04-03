const BRAND = "#5B63F5";
const BRAND_GLOW = "rgba(91,99,245,0.22)";
const BG = "#09090b";
const CARD = "#0f0f12";
const CARD_INNER = "#131318";
const BORDER = "rgba(255,255,255,0.07)";
const BORDER_BRAND = "rgba(91,99,245,0.28)";
const TEXT = "#f4f4f5";
const MUTED = "#a1a1aa";
const VERY_MUTED = "#71717a";

// Matches tier-assessment.tsx badge styles
const TIER_BADGE: Record<string, { color: string; bg: string; border: string }> = {
  Foundation: { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.3)" },
  Growth: { color: BRAND, bg: "rgba(91,99,245,0.08)", border: BORDER_BRAND },
  Optimization: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)" },
};

const AI_BADGE: Record<string, { color: string; bg: string; border: string }> = {
  High: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)" },
  Moderate: { color: BRAND, bg: "rgba(91,99,245,0.08)", border: BORDER_BRAND },
  Low: { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.3)" },
};

// Matches tier-assessment.tsx TIER_DESCRIPTIONS
const TIER_COPY: Record<string, string> = {
  Foundation: "Small, strategic changes to capture leads will have massive impact. You're leaving the most money on the table from basic response gaps.",
  Growth: "Your volume is outstripping your infrastructure. Automation isn't optional anymore — it's the difference between scaling and stalling.",
  Optimization: "You have the volume and the systems. Bespoke AI workflows will turn your stack into a compounding revenue engine.",
};

const PACKAGE_DESC: Record<string, string> = {
  "Foundation Kit": "Core AI systems to capture leads, automate follow-up, and stop revenue from slipping through the cracks.",
  "Operating System": "A complete AI-powered business operating system — from lead intake to pipeline management.",
  "Studio": "Custom AI agents, advanced automations, and bespoke workflows built around your business.",
};

export interface AuditEmailQuickWin {
  title: string;
  recoveredMonthly: number;
}

export interface AuditEmailData {
  firstName: string;
  tierLabel: string;
  totalScore: number;
  realisticMonthly: number;
  realisticAnnual: number;
  recommendedPackage: string;
  aiReadinessScore: string;
  aiReadinessDescription: string;
  leads: number;
  leakRate: number;
  quickWins: AuditEmailQuickWin[];
  reportUrl: string;
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function pct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export function buildAuditEmail(data: AuditEmailData): string {
  const tier = TIER_BADGE[data.tierLabel] ?? TIER_BADGE.Growth;
  const ai = AI_BADGE[data.aiReadinessScore] ?? AI_BADGE.Moderate;
  const tierCopy = TIER_COPY[data.tierLabel] ?? "";
  const pkgDesc = PACKAGE_DESC[data.recommendedPackage] ?? "";
  const topWin = data.quickWins[0];

  const leakedLeads = Math.round(data.leads * data.leakRate);
  const leakPct = pct(data.leakRate);

  // AI readiness insight — use the description if provided, fallback to generic
  const aiInsight =
    data.aiReadinessDescription ||
    (data.aiReadinessScore === "High"
      ? "Your systems and team mindset are fully primed to deploy bespoke AI agents for maximum leverage."
      : data.aiReadinessScore === "Moderate"
        ? "Your infrastructure is scaling — strategic AI workflows will compound your revenue without adding headcount."
        : "Locking in core automation foundations first will make every AI dollar work harder.");

  // Gauge: Low always active; Moderate active if Moderate or High; High active only if High
  const gaugeMod = data.aiReadinessScore === "Moderate" || data.aiReadinessScore === "High";
  const gaugeHigh = data.aiReadinessScore === "High";
  const gaugeCell = (active: boolean) =>
    `padding:10px 6px;text-align:center;background:${active ? ai.bg : CARD};border:1px solid ${active ? ai.border : BORDER};`;
  const gaugeText = (active: boolean) =>
    `margin:0;font-size:12px;font-weight:700;color:${active ? ai.color : VERY_MUTED};`;

  const quickWinBlock = topWin
    ? `
          <!-- Quick Win -->
          <tr>
            <td style="padding:0 24px 24px;">
              <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">Highest-Impact Quick Win</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CARD_INNER};border:1px solid ${BORDER};border-left:3px solid ${BRAND};border-radius:0 12px 12px 0;">
                <tr>
                  <td style="padding:18px 22px;">
                    <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${TEXT};letter-spacing:-0.01em;">${topWin.title}</p>
                    <p style="margin:0 0 10px;font-size:13px;color:${MUTED};line-height:1.6;">The single fastest lever to recover revenue based on your answers.</p>
                    <p style="margin:0;font-size:14px;color:${BRAND};font-weight:700;letter-spacing:-0.01em;">+$${fmt(topWin.recoveredMonthly)}<span style="font-size:13px;font-weight:500;color:${MUTED};"> / mo estimated recovery</span></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Your Market Stack Audit Results</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:24px 10px 40px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Main card -->
          <tr>
            <td style="background:${CARD};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Brand accent line + glow -->
                <tr>
                  <td style="height:2px;background:linear-gradient(90deg,transparent 0%,${BRAND} 35%,${BRAND} 65%,transparent 100%);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="background:radial-gradient(ellipse 80% 120% at 50% 0%,${BRAND_GLOW} 0%,transparent 70%);padding:28px 24px 0;">
                    <p style="margin:0;font-size:10px;font-weight:700;color:${BRAND};text-transform:uppercase;letter-spacing:0.14em;">AI Systems Report &middot; Market Stack</p>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding:16px 24px 28px;">
                    <h1 style="margin:0 0 14px;font-size:26px;font-weight:800;color:${TEXT};line-height:1.2;letter-spacing:-0.03em;">Hi ${data.firstName},<br>here&#39;s what we found.</h1>
                    <p style="margin:0;font-size:16px;color:${MUTED};line-height:1.7;">We ran your answers through our revenue analysis engine and pinpointed the exact system gaps costing you money right now. Here&#39;s your breakdown.</p>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="height:1px;background:${BORDER};font-size:0;line-height:0;">&nbsp;</td></tr>

                <!-- Revenue hero -->
                <tr>
                  <td style="padding:36px 24px 32px;text-align:center;">
                    <p style="margin:0 0 20px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.16em;">Estimated Revenue at Risk &mdash; Monthly</p>
                    <p style="margin:0 0 10px;font-size:64px;font-weight:800;color:${BRAND};line-height:1;letter-spacing:-0.04em;text-shadow:0 0 60px ${BRAND_GLOW};">$${fmt(data.realisticMonthly)}</p>
                    <p style="margin:0 0 20px;font-size:15px;color:${MUTED};">That&#39;s $${fmt(data.realisticAnnual)} slipping away each year from leads you&#39;re already generating.</p>
                    <span style="display:inline-block;padding:5px 16px;border-radius:100px;font-size:12px;font-weight:700;color:${tier.color};background:${tier.bg};border:1px solid ${tier.border};">${data.tierLabel} Stage</span>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="height:1px;background:${BORDER};font-size:0;line-height:0;">&nbsp;</td></tr>

                <!-- Contextual stats: Leaked Leads + Response Gap -->
                <tr>
                  <td style="padding:24px 24px;">
                    <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">Where the money is leaking</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Leaked leads -->
                        <td width="48%" style="background:${CARD_INNER};border:1px solid ${BORDER};border-radius:12px;padding:20px 24px;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">Est. Leads Lost</p>
                          <p style="margin:0 0 10px;font-size:44px;font-weight:800;color:${TEXT};line-height:1;letter-spacing:-0.03em;">${leakedLeads}<span style="font-size:16px;font-weight:500;color:${VERY_MUTED};letter-spacing:0;">&thinsp;/mo</span></p>
                          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;">Out of ${data.leads} leads/mo, an estimated ${leakPct} go uncontacted or fall through before you can respond.</p>
                        </td>
                        <td width="4%"></td>
                        <!-- Response gap -->
                        <td width="48%" style="background:${CARD_INNER};border:1px solid ${BORDER};border-radius:12px;padding:20px 24px;vertical-align:top;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">Response Gap</p>
                          <p style="margin:0 0 10px;font-size:44px;font-weight:800;color:${TEXT};line-height:1;letter-spacing:-0.03em;">${leakPct}</p>
                          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.6;">Your current setup lets ${leakPct} of leads slip away. AI-assisted response can close this gap to under 10%.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Tier assessment -->
                <tr>
                  <td style="padding:0 24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CARD_INNER};border:1px solid ${BORDER};border-radius:12px;">
                      <tr>
                        <td style="padding:20px 22px;">
                          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">${data.tierLabel} Stage &mdash; What This Means For You</p>
                          <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.75;">${tierCopy}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- AI Readiness -->
                <tr>
                  <td style="padding:0 24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CARD_INNER};border:1px solid ${BORDER};border-radius:12px;">
                      <tr>
                        <td style="padding:20px 22px;">
                          <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">AI Readiness</p>
                          <!-- 3-cell gauge -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;border-radius:8px;overflow:hidden;">
                            <tr>
                              <td width="32%" style="${gaugeCell(true)}border-radius:8px 0 0 8px;">
                                <p style="${gaugeText(true)}">Low</p>
                              </td>
                              <td width="2%" style="padding:0;font-size:0;line-height:0;background:${BG};">&nbsp;</td>
                              <td width="32%" style="${gaugeCell(gaugeMod)}">
                                <p style="${gaugeText(gaugeMod)}">Moderate</p>
                              </td>
                              <td width="2%" style="padding:0;font-size:0;line-height:0;background:${BG};">&nbsp;</td>
                              <td width="32%" style="${gaugeCell(gaugeHigh)}border-radius:0 8px 8px 0;">
                                <p style="${gaugeText(gaugeHigh)}">High</p>
                              </td>
                            </tr>
                          </table>
                          <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${ai.color};letter-spacing:-0.01em;">${data.aiReadinessScore} Readiness</p>
                          <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.65;">${aiInsight}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr><td style="height:1px;background:${BORDER};font-size:0;line-height:0;">&nbsp;</td></tr>

                <!-- Recommended package -->
                <tr>
                  <td style="padding:24px 24px 22px;">
                    <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">Your Recommended Starting Point</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CARD_INNER};border:1px solid ${BORDER_BRAND};border-radius:12px;box-shadow:0 0 32px ${BRAND_GLOW};">
                      <tr>
                        <td style="padding:20px 22px;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:${BRAND};text-transform:uppercase;letter-spacing:0.1em;">Recommended Package</p>
                          <p style="margin:0 0 10px;font-size:18px;font-weight:800;color:${TEXT};letter-spacing:-0.02em;">${data.recommendedPackage}</p>
                          <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.7;">${pkgDesc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${quickWinBlock}

                <!-- CTA -->
                <tr>
                  <td style="padding:8px 24px 44px;text-align:center;">
                    <a href="${data.reportUrl}" style="display:inline-flex;gap:6px;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:8px;letter-spacing:-0.01em;color:#ffffff;background:linear-gradient(to bottom,rgba(91,99,245,0.7),rgba(91,99,245,1));border-top:1px solid rgba(91,99,245,0.8);box-shadow:0 0 48px ${BRAND_GLOW},0 1px 3px rgba(0,0,0,0.3);">View Full Report <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg></a>
                    <p style="margin:18px 0 0;font-size:14px;color:${MUTED};line-height:1.65;">Your report includes a full breakdown, quick wins, and an action plan built around your answers.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Logo + Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;">
              <img src="https://marketstack.ai/favicons/android-chrome-192x192.png" width="36" height="36" alt="Market Stack" style="display:block;margin:0 auto 16px;border-radius:9px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${VERY_MUTED};letter-spacing:-0.01em;">Market Stack</p>
              <p style="margin:0 0 14px;font-size:12px;color:${VERY_MUTED};">AI Systems &amp; Automation for Growing Businesses</p>
              <p style="margin:0;font-size:12px;">
                <a href="https://marketstack.ai" style="color:${BRAND};text-decoration:none;font-weight:600;">marketstack.ai</a>
                <span style="color:#27272a;">&nbsp;&middot;&nbsp;</span>
                <a href="mailto:admin@marketstack.ai" style="color:${VERY_MUTED};text-decoration:none;">admin@marketstack.ai</a>
                <span style="color:#27272a;">&nbsp;&middot;&nbsp;</span>
                <a href="{{email.unsubscribe_link}}" style="color:${VERY_MUTED};text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
