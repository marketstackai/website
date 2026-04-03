"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { QuizData } from "@/lib/audit/types";
import { INDUSTRY_LABELS, RESPONSE_METHOD_LABELS } from "@/lib/audit/constants";

interface QuizInputPanelProps {
  data: QuizData;
  onChange: (data: QuizData) => void;
  onReset: () => void;
  onPreset: (name: string) => void;
}

const CHALLENGES = [
  { value: "missed_leads", label: "Missed Leads" },
  { value: "pipeline_stuck", label: "Pipeline Stuck" },
  { value: "manual_tasks", label: "Manual Tasks" },
  { value: "tool_disconnect", label: "Tool Disconnect" },
  { value: "unsure_ai", label: "Unsure About AI" },
];

const AI_LEVELS = [
  { value: "no_ai", label: "No AI" },
  { value: "ai_poor_results", label: "Poor Results" },
  { value: "ai_some_results", label: "Some Results" },
  { value: "ai_advanced", label: "Advanced" },
];

const URGENCY_LEVELS = [
  { value: "urgent", label: "Urgent" },
  { value: "1_3_months", label: "1–3 Months" },
  { value: "3_6_months", label: "3–6 Months" },
  { value: "exploring", label: "Exploring" },
];

const PRESETS = [
  "High-Value Home Services",
  "New E-Commerce",
  "Enterprise Tech",
  "Foundation (Min)",
];

const selectClass = "w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:border-brand outline-none";
const inputClass = "w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm tabular-nums focus:border-brand outline-none";
const labelClass = "text-xs font-bold uppercase tracking-widest text-muted-foreground";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export function QuizInputPanel({ data, onChange, onReset, onPreset }: QuizInputPanelProps) {
  const set = <K extends keyof QuizData>(key: K, value: QuizData[K]) =>
    onChange({ ...data, [key]: value });

  const toggleChallenge = (c: string) => {
    const next = data.biggest_challenges.includes(c)
      ? data.biggest_challenges.filter(v => v !== c)
      : [...data.biggest_challenges, c];
    set("biggest_challenges", next);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Quiz Inputs</h2>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-foreground h-7 px-2">
          <RotateCcw className="size-3 mr-1" /> Reset
        </Button>
      </div>

      <Field label="Preset">
        <select
          className={selectClass}
          value=""
          onChange={e => { if (e.target.value) onPreset(e.target.value); }}
        >
          <option value="">Load preset...</option>
          {PRESETS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </Field>

      <div className="border-t border-border pt-4 space-y-4">
        <Field label="Industry">
          <select className={selectClass} value={data.industry} onChange={e => set("industry", e.target.value)}>
            {Object.entries(INDUSTRY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>

        {data.industry === "other" && (
          <Field label="Industry (Other)">
            <input className={inputClass} value={data.industry_other} onChange={e => set("industry_other", e.target.value)} placeholder="e.g. Solar Installation" />
          </Field>
        )}

        <Field label="Team Size">
          <input className={inputClass} type="number" min={1} value={data.team_size} onChange={e => set("team_size", e.target.value)} />
        </Field>

        <Field label="Monthly Revenue">
          <div className="flex gap-2">
            <input
              className={inputClass}
              type="number"
              min={0}
              value={data.monthly_revenue === "undisclosed" ? "" : data.monthly_revenue}
              onChange={e => set("monthly_revenue", e.target.value)}
              disabled={data.monthly_revenue === "undisclosed"}
              placeholder="175000"
            />
            <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={data.monthly_revenue === "undisclosed"}
                onChange={e => set("monthly_revenue", e.target.checked ? "undisclosed" : "")}
                className="accent-brand"
              />
              N/A
            </label>
          </div>
        </Field>

        <Field label="Avg Job Value">
          <div className="flex gap-2">
            <input
              className={inputClass}
              type="number"
              min={0}
              value={data.avg_job_value === "undisclosed" ? "" : data.avg_job_value}
              onChange={e => set("avg_job_value", e.target.value)}
              disabled={data.avg_job_value === "undisclosed"}
              placeholder="6000"
            />
            <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={data.avg_job_value === "undisclosed"}
                onChange={e => set("avg_job_value", e.target.checked ? "undisclosed" : "")}
                className="accent-brand"
              />
              N/A
            </label>
          </div>
        </Field>

        <Field label="Monthly Leads">
          <div className="flex gap-2">
            <input
              className={inputClass}
              type="number"
              min={0}
              value={data.monthly_leads === "not_sure" ? "" : data.monthly_leads}
              onChange={e => set("monthly_leads", e.target.value)}
              disabled={data.monthly_leads === "not_sure"}
              placeholder="50"
            />
            <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={data.monthly_leads === "not_sure"}
                onChange={e => set("monthly_leads", e.target.checked ? "not_sure" : "")}
                className="accent-brand"
              />
              N/A
            </label>
          </div>
        </Field>

        <Field label="Challenges">
          <div className="flex flex-wrap gap-1.5">
            {CHALLENGES.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => toggleChallenge(c.value)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  data.biggest_challenges.includes(c.value)
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-muted-foreground hover:border-brand/50"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Lead Response">
          <select className={selectClass} value={data.lead_response} onChange={e => set("lead_response", e.target.value)}>
            <option value="">Select...</option>
            {Object.entries(RESPONSE_METHOD_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </Field>

        <Field label="AI Experience">
          <select className={selectClass} value={data.ai_experience} onChange={e => set("ai_experience", e.target.value)}>
            <option value="">Select...</option>
            {AI_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </Field>

        <Field label="Urgency">
          <select className={selectClass} value={data.urgency} onChange={e => set("urgency", e.target.value)}>
            <option value="">Select...</option>
            {URGENCY_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}
