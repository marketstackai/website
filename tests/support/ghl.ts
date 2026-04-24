import fs from "node:fs";
import path from "node:path";

loadEnvFile();

const GHL_BASE = "https://services.leadconnectorhq.com";
const API_VERSION = "2021-07-28";
const TEST_EMAIL_REGEX = /^test\+audit-\d+-[a-z0-9]+@marketstack\.ai$/i;

function loadEnvFile() {
  if (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID) return;
  try {
    const raw = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {
    // ignore
  }
}

function env() {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    throw new Error("GHL_API_KEY and GHL_LOCATION_ID must be set (via .env.local or environment)");
  }
  return { apiKey, locationId };
}

function headers(extra: Record<string, string> = {}) {
  const { apiKey } = env();
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: API_VERSION,
    ...extra,
  };
}

export interface GhlCustomField {
  id: string;
  value?: string;
  fieldValue?: string | string[];
  fieldValueString?: string;
  fieldValueArray?: string[];
}

export interface GhlContact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  companyName?: string;
  website?: string;
  tags?: string[];
  customFields?: GhlCustomField[];
  dateAdded?: string;
  // GHL translates sms_consent form input into native dndSettings.SMS via workflow.
  // status "inactive" = DND off = contact opted in; "active" = DND on = opted out.
  dndSettings?: {
    SMS?: { status?: "active" | "inactive"; message?: string };
    Email?: { status?: "active" | "inactive"; message?: string };
    [channel: string]: { status?: "active" | "inactive"; message?: string } | undefined;
  };
}

export interface AuditRecordProperties {
  industry?: string;
  industry_other?: string;
  team_size?: number;
  monthly_revenue?: number;
  avg_job_value?: number;
  monthly_leads?: number;
  biggest_challenges?: string[];
  lead_response?: string;
  ai_experience?: string;
  ai_detail?: string;
  urgency?: string;
  additional_notes?: string;
  website?: string;
  recommended?: string;
  name?: string;
  [k: string]: unknown;
}

export interface AuditRecord {
  id: string;
  locationId: string;
  properties: AuditRecordProperties;
}

export function makeTestEmail(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `test+audit-${ts}-${rand}@marketstack.ai`;
}

export function isTestEmail(email: string): boolean {
  return TEST_EMAIL_REGEX.test(email);
}

export interface CreateTestContactInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  website?: string;
  smsConsent?: boolean;
  marketingConsent?: boolean;
  source?: string;
}

export async function createTestContact(input: CreateTestContactInput): Promise<{ id: string }> {
  const { locationId } = env();
  const body: Record<string, unknown> = {
    locationId,
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
    companyName: input.companyName,
    website: input.website,
    tags: ["test"],
  };
  if (input.source) body.source = input.source;

  const customFields: Array<{ id: string; field_value: string }> = [];
  if (input.smsConsent !== undefined) {
    customFields.push({ id: "gEW3wbkH3Ozl2t9AvEL5", field_value: input.smsConsent ? "Yes" : "No" });
  }
  if (input.marketingConsent !== undefined) {
    customFields.push({ id: "JnitmKqDrHkP7JOCcY41", field_value: input.marketingConsent ? "Yes" : "No" });
  }
  if (customFields.length) body.customFields = customFields;

  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`createTestContact failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as { contact?: { id: string } };
  const id = data.contact?.id;
  if (!id) throw new Error(`createTestContact: no contact.id in response ${JSON.stringify(data)}`);
  return { id };
}

export async function getContactByEmail(email: string): Promise<GhlContact | null> {
  const { locationId } = env();
  const url = `${GHL_BASE}/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return null;
  const data = (await res.json()) as { contacts?: GhlContact[] };
  return data.contacts?.find((c) => c.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getAllContactsByEmail(email: string): Promise<GhlContact[]> {
  const { locationId } = env();
  const url = `${GHL_BASE}/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return [];
  const data = (await res.json()) as { contacts?: GhlContact[] };
  return (data.contacts ?? []).filter((c) => c.email?.toLowerCase() === email.toLowerCase());
}

export async function getContactById(id: string): Promise<GhlContact> {
  const res = await fetch(`${GHL_BASE}/contacts/${id}`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`getContactById(${id}) failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { contact: GhlContact };
  return data.contact;
}

export async function deleteContact(id: string): Promise<void> {
  const res = await fetch(`${GHL_BASE}/contacts/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`deleteContact(${id}) failed (${res.status}): ${await res.text()}`);
  }
}

const AUDIT_ASSOCIATION_ID = process.env.GHL_AUDIT_ASSOCIATION_ID ?? "69cb019b83fc21e8f5928b7a";

export async function getAssociatedAuditRecord(contactId: string): Promise<AuditRecord | null> {
  const { locationId } = env();
  const assocUrl = `${GHL_BASE}/associations/relations/${contactId}?locationId=${locationId}`;
  const assocRes = await fetch(assocUrl, { headers: headers() });
  if (!assocRes.ok) return null;
  const assocData = (await assocRes.json()) as {
    relations?: Array<{ id?: string; firstRecordId: string; secondRecordId: string; associationId?: string }>;
  };
  const relations = assocData.relations ?? [];
  const auditRel = relations.find((r) => r.associationId === AUDIT_ASSOCIATION_ID);
  if (!auditRel) return null;
  const recordId = auditRel.firstRecordId === contactId ? auditRel.secondRecordId : auditRel.firstRecordId;
  const recRes = await fetch(
    `${GHL_BASE}/objects/custom_objects.audit/records/${recordId}?locationId=${locationId}`,
    { headers: headers() },
  );
  if (!recRes.ok) return null;
  const recData = (await recRes.json()) as { record: AuditRecord };
  return recData.record;
}

export async function pollAssociatedAuditRecord(
  contactId: string,
  predicate: (record: AuditRecord) => boolean,
  opts: { timeoutMs?: number; intervalMs?: number } = {},
): Promise<AuditRecord | null> {
  const timeoutMs = opts.timeoutMs ?? 20_000;
  const intervalMs = opts.intervalMs ?? 1_000;
  const deadline = Date.now() + timeoutMs;
  let last: AuditRecord | null = null;
  while (Date.now() < deadline) {
    try {
      const record = await getAssociatedAuditRecord(contactId);
      if (record) {
        last = record;
        if (predicate(record)) return record;
      }
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return last;
}

export async function waitForContactIndexed(
  email: string,
  opts: { timeoutMs?: number; intervalMs?: number } = {},
): Promise<GhlContact> {
  const timeoutMs = opts.timeoutMs ?? 30_000;
  const intervalMs = opts.intervalMs ?? 1_000;
  const deadline = Date.now() + timeoutMs;
  // Require 2 consecutive hits — GHL's search index is eventually consistent and can flicker.
  let lastHit: GhlContact | null = null;
  while (Date.now() < deadline) {
    const contact = await getContactByEmail(email);
    if (contact && lastHit && contact.id === lastHit.id) return contact;
    lastHit = contact;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`waitForContactIndexed timeout: ${email} not stably indexed in GHL search within ${timeoutMs}ms`);
}

export async function pollContactCustomField<T = unknown>(
  contactId: string,
  predicate: (contact: GhlContact) => T | null,
  opts: { timeoutMs?: number; intervalMs?: number } = {},
): Promise<T | null> {
  const timeoutMs = opts.timeoutMs ?? 20_000;
  const intervalMs = opts.intervalMs ?? 1_000;
  const deadline = Date.now() + timeoutMs;
  let last: T | null = null;
  while (Date.now() < deadline) {
    try {
      const contact = await getContactById(contactId);
      const hit = predicate(contact);
      if (hit) return hit;
      last = hit;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return last;
}

export async function sweepOrphanedTestContacts(maxAgeMinutes = 60): Promise<{
  scanned: number;
  deleted: number;
  deletedIds: string[];
}> {
  const { locationId } = env();
  const url = `${GHL_BASE}/contacts/?locationId=${locationId}&query=test%2Baudit-`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`sweep failed (${res.status}): ${await res.text()}`);
  const data = (await res.json()) as { contacts?: GhlContact[] };
  const contacts = data.contacts ?? [];
  const cutoff = Date.now() - maxAgeMinutes * 60_000;
  const deletedIds: string[] = [];

  for (const c of contacts) {
    if (!c.email || !isTestEmail(c.email)) continue;
    if (c.dateAdded) {
      const added = new Date(c.dateAdded).getTime();
      if (Number.isFinite(added) && added > cutoff) continue;
    }
    await deleteContact(c.id);
    deletedIds.push(c.id);
  }

  return { scanned: contacts.length, deleted: deletedIds.length, deletedIds };
}

export function extractCustomField(contact: GhlContact, fieldId: string): string | string[] | undefined {
  const f = contact.customFields?.find((x) => x.id === fieldId);
  if (!f) return undefined;
  return f.value ?? f.fieldValueString ?? f.fieldValueArray ?? f.fieldValue;
}

export const FIELD_IDS = {
  smsConsent: "gEW3wbkH3Ozl2t9AvEL5",
  marketingConsent: "JnitmKqDrHkP7JOCcY41",
  recommendation: "ukVdGi6W4efUGx3SIqHG",
  interests: "6OW3rNue3BDI1P0zB7qc",
} as const;
