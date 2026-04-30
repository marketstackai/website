import { NextResponse } from "next/server";
import { buildAuditEmail } from "@/lib/audit/email";

const MOCK_DATA = {
  firstName: "Teddy",
  tierLabel: "Growth",
  totalScore: 14,
  maxImpactMonthly: 28500,
  maxImpactAnnual: 342000,
  recommendedPackage: "Operating System",
  aiReadinessScore: "Moderate",
  aiReadinessDescription: "Your infrastructure is scaling — strategic AI workflows will compound your revenue without adding headcount.",
  leads: 50,
  leakRate: 0.38,
  quickWins: [
    { title: "AI Receptionist & Missed Call Recovery", recoveredMonthly: 6200 },
  ],
  reportUrl: "http://localhost:3000/audit/report?id=preview",
};

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const html = buildAuditEmail(MOCK_DATA);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { contactId } = await request.json() as { contactId: string };
  const apiKey = process.env.GHL_API_KEY;

  if (!apiKey || !contactId) {
    return NextResponse.json({ error: "Missing apiKey or contactId" }, { status: 400 });
  }

  const html = buildAuditEmail(MOCK_DATA);

  const res = await fetch("https://services.leadconnectorhq.com/conversations/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "Email",
      contactId,
      subject: "Your AI Readiness Report",
      html,
    }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
