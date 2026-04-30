import { getRecommendedStack, TIER_DESCRIPTIONS } from "./display";

const BRAND = "#5271FF";
const BRAND_RGB = "82,113,255";
const BRAND_GLOW = `rgba(${BRAND_RGB},0.12)`;
const BG = "#09090b";
const CARD = "#0f0f12";
const CARD_INNER = "#131318";
const BORDER = "rgba(255,255,255,0.04)";
const BORDER_BRAND = `rgba(${BRAND_RGB},0.22)`;
const TEXT = "#f4f4f5";
const MUTED = "#a1a1aa";
const VERY_MUTED = "#71717a";
const FONT_STACK = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

const AI_BADGE: Record<string, { color: string; bg: string; border: string }> = {
  High: { color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)" },
  Moderate: { color: BRAND, bg: `rgba(${BRAND_RGB},0.08)`, border: BORDER_BRAND },
  Low: { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "rgba(249,115,22,0.3)" },
};

export interface AuditEmailQuickWin {
  title: string;
  recoveredMonthly: number;
}

export interface AuditEmailData {
  firstName: string;
  tierLabel: string;
  totalScore: number;
  maxImpactMonthly: number;
  maxImpactAnnual: number;
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

export function buildAuditEmail(data: AuditEmailData): string {
  const ai = AI_BADGE[data.aiReadinessScore] ?? AI_BADGE.Moderate;
  const tierCopy = TIER_DESCRIPTIONS[data.tierLabel as keyof typeof TIER_DESCRIPTIONS] ?? "";
  const recommendedStack = getRecommendedStack(data.recommendedPackage);
  const recommendedStackTitle = recommendedStack?.title ?? data.recommendedPackage;
  const recommendedStackDescription = recommendedStack?.emailDescription ?? "";
  const recommendedStackPrice = recommendedStack?.priceRange ?? "";
  const recommendedStackTimeline = recommendedStack?.timeline ?? "";
  
  const filteredWins = data.quickWins.filter(win => 
    win.title.toLowerCase() !== recommendedStackTitle.toLowerCase()
  );
  const topWin = filteredWins[0];

  const activeIndex = data.aiReadinessScore === "High" ? 2 : data.aiReadinessScore === "Moderate" ? 1 : 0;
  
  const gaugeBar = (index: number) => {
    const isActive = index <= activeIndex;
    const isCurrent = index === activeIndex;
    const barColor = isActive ? ai.color : VERY_MUTED;
    const opacity = isActive ? (isCurrent ? "1" : "0.4") : "0.15";
    
    return `
      <td width="32%" style="padding:0;">
        <div style="height:6px;background:${barColor};border-radius:100px;opacity:${opacity};"></div>
      </td>
    `;
  };

  const gaugeLabel = (index: number) => {
    const isActive = index <= activeIndex;
    const isCurrent = index === activeIndex;
    const color = isActive ? ai.color : VERY_MUTED;
    const opacity = isActive ? (isCurrent ? "1" : "0.5") : "0.25";
    const label = ["LOW", "MODERATE", "HIGH"][index];
    
    return `
      <td width="32%" style="padding:8px 0 0;">
        <p style="margin:0;font-size:9px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.1em;opacity:${opacity};">${label}</p>
      </td>
    `;
  };

  const ctaButton = `
    <a href="${data.reportUrl}" style="display:inline-flex;gap:6px;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;letter-spacing:0;color:#ffffff;background:linear-gradient(to bottom,rgba(${BRAND_RGB},0.8),rgba(${BRAND_RGB},1));border-top:1px solid rgba(255,255,255,0.1);box-shadow:0 0 32px ${BRAND_GLOW};">View Full Report <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-left:4px;"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg></a>
  `;

  const quickWinBlock = topWin
    ? `
          <!-- Quick Win -->
          <tr>
            <td style="padding:28px 24px 28px;">
              <p style="margin:0 0 14px;font-size:10px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.14em;">Highest-Impact Quick Win</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CARD_INNER};border:1px solid ${BORDER};border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:${TEXT};">${topWin.title}</p>
                    <p style="margin:0 0 14px;font-size:13px;color:${MUTED};line-height:1.6;">The fastest lever to recover revenue based on your current gaps.</p>
                    <p style="margin:0;font-size:15px;color:${BRAND};font-weight:700;">+$${fmt(topWin.recoveredMonthly)}<span style="font-size:13px;font-weight:500;color:${MUTED};"> / mo recovery</span></p>
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
  <title>Market Stack AI Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body, table, td, p, a, h1, h2, span { font-family:${FONT_STACK}; }
  </style>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT_STACK};-webkit-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:24px 10px 48px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background:${CARD};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Header line -->
                <tr>
                  <td style="height:2px;background:linear-gradient(90deg,transparent 0%,${BRAND} 35%,${BRAND} 65%,transparent 100%);line-height:0;font-size:0;">&nbsp;</td>
                </tr>
                <!-- Header -->
                <tr>
                  <td style="background:radial-gradient(ellipse 60% 80% at 50% 0%,${BRAND_GLOW} 0%,transparent 65%);padding:28px 24px 0;">
                    <p style="margin:0;font-size:10px;font-weight:700;color:${BRAND};text-transform:uppercase;letter-spacing:0.16em;">AI Systems Report &middot; Market Stack</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 24px 28px;">
                    <h1 style="margin:0 0 14px;font-size:28px;font-weight:800;color:${TEXT};line-height:1.2;letter-spacing:-0.02em;">Hi ${data.firstName},<br>here&#39;s what we found.</h1>
                    <p style="margin:0;font-size:16px;color:${MUTED};line-height:1.7;">We analyzed your systems for AI potential. Your infrastructure is currently letting significant revenue slip through the cracks — but it's recoverable.</p>
                  </td>
                </tr>

                <!-- 1px Divider -->
                <tr><td style="height:1px;background:${BORDER};line-height:0;font-size:0;">&nbsp;</td></tr>

                <!-- Revenue Hero -->
                <tr>
                  <td style="padding:44px 24px 40px;text-align:center;">
                    <p style="margin:0 0 20px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.18em;">Estimated Revenue Lost &mdash; Monthly</p>
                    <div style="margin-bottom:12px;">
                      <p style="margin:0;font-size:72px;font-weight:800;color:${BRAND};line-height:1;letter-spacing:-0.03em;text-shadow:0 0 40px ${BRAND_GLOW};">$${fmt(data.maxImpactMonthly)}</p>
                    </div>
                    <p style="margin:0 0 28px;font-size:16px;color:${MUTED};">That&#39;s $${fmt(data.maxImpactAnnual)} each year from leads you&#39;re already generating.</p>
                    <div style="margin-bottom:32px;">
                      ${ctaButton}
                    </div>
                  </td>
                </tr>

                <!-- 1px Divider -->
                <tr><td style="height:1px;background:${BORDER};line-height:0;font-size:0;">&nbsp;</td></tr>

                <!-- AI Readiness (Report Aesthetic Sync) -->
                <tr>
                  <td style="padding:36px 24px 32px;">
                    <p style="margin:0 0 18px;font-size:10px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.14em;">AI Readiness Score</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="vertical-align:middle;">
                          <h2 style="margin:0;font-size:48px;font-weight:800;color:${ai.color};line-height:1;letter-spacing:-0.02em;">${data.aiReadinessScore}</h2>
                        </td>
                      </tr>
                    </table>

                    <!-- Progress Bar (Thin rounded lines + labels below) -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                      <tr>
                        ${gaugeBar(0)}
                        <td width="2%">&nbsp;</td>
                        ${gaugeBar(1)}
                        <td width="2%">&nbsp;</td>
                        ${gaugeBar(2)}
                      </tr>
                      <tr>
                        ${gaugeLabel(0)}
                        <td width="2%">&nbsp;</td>
                        ${gaugeLabel(1)}
                        <td width="2%">&nbsp;</td>
                        ${gaugeLabel(2)}
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CARD_INNER};border:1px solid ${BORDER};border-radius:12px;">
                      <tr>
                        <td style="padding:22px 24px;">
                          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.12em;">Strategic Context</p>
                          <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.75;">${tierCopy}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 1px Divider -->
                <tr><td style="height:1px;background:${BORDER};line-height:0;font-size:0;">&nbsp;</td></tr>

                <!-- Recommended stack -->
                <tr>
                  <td style="padding:36px 24px 32px;">
                    <p style="margin:0 0 18px;font-size:10px;font-weight:700;color:${VERY_MUTED};text-transform:uppercase;letter-spacing:0.14em;">Recommended Infrastructure</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CARD_INNER};border:1px solid ${BORDER_BRAND};border-radius:12px;box-shadow:0 0 40px ${BRAND_GLOW};">
                      <tr>
                        <td style="padding:28px 30px 30px;">
                          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:${BRAND};text-transform:uppercase;letter-spacing:0.14em;">Primary Solution</p>
                          <h1 style="margin:0 0 12px;font-size:28px;font-weight:700;color:${TEXT};line-height:1.1;letter-spacing:-0.02em;">${recommendedStackTitle}</h1>
                          <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:${BRAND};">${recommendedStackPrice}${recommendedStackTimeline ? `<span style="font-size:14px;font-weight:500;color:${MUTED};"> &middot; ${recommendedStackTimeline}</span>` : ""}</p>
                          <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.7;">${recommendedStackDescription}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 1px Divider -->
                <tr><td style="height:1px;background:${BORDER};line-height:0;font-size:0;">&nbsp;</td></tr>

                ${quickWinBlock}

                <!-- Bottom CTA -->
                <tr>
                  <td style="padding:16px 24px 52px;text-align:center;">
                    ${ctaButton}
                    <p style="margin:24px 0 0;font-size:14px;color:${VERY_MUTED};line-height:1.6;">Your report includes a full breakdown, additional quick wins, and the exact action plan to capture your leaking revenue.</p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;text-align:center;">
              <img src="https://marketstack.ai/favicons/android-chrome-192x192.png" width="42" height="42" alt="Market Stack" style="display:block;margin:0 auto 20px;border-radius:10px;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:${VERY_MUTED};letter-spacing:0.02em;">Market Stack</p>
              <p style="margin:0 0 20px;font-size:12px;color:${VERY_MUTED};line-height:1.6;">AI Systems &amp; Automation for Scaling Businesses</p>
              <p style="margin:0;font-size:12px;">
                <a href="https://marketstack.ai" style="color:${BRAND};text-decoration:none;font-weight:600;">marketstack.ai</a>
                <span style="color:${BORDER};">&nbsp;&middot;&nbsp;</span>
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
