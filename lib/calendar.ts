export const CALENDAR_ID = "3kaQEdii0FF1El7xKgWY";

// Mirrors the calendar's own booking-window config in GHL
// (allowBookingAfter / allowBookingFor).
export const MIN_DAYS_OUT = 2;
export const MAX_DAYS_OUT = 20;

// Mirrors the calendar's configured slot length in GHL.
export const MEETING_DURATION_MINUTES = 30;

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getTimezoneLabel(timezone: string = getBrowserTimezone()): string {
  const city = timezone.split("/").pop()?.replace(/_/g, " ") ?? timezone;
  const abbreviation = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "short",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;

  return abbreviation ? `${city} (${abbreviation})` : city;
}

export interface TimezoneOption {
  value: string;
  label: string;
}

export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: "Pacific/Honolulu", label: "Hawaii" },
  { value: "America/Anchorage", label: "Alaska" },
  { value: "America/Los_Angeles", label: "Pacific Time - US & Canada" },
  { value: "America/Denver", label: "Mountain Time - US & Canada" },
  { value: "America/Phoenix", label: "Arizona" },
  { value: "America/Chicago", label: "Central Time - US & Canada" },
  { value: "America/New_York", label: "Eastern Time - US & Canada" },
];

export function getTimezoneOptionLabel(timezone: string): string {
  return COMMON_TIMEZONES.find((tz) => tz.value === timezone)?.label ?? getTimezoneLabel(timezone);
}

function getTimezoneOffsetMinutes(timezone: string): number {
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;

  const match = offset?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

// All IANA zones, US & Canada pinned first, then everything else ordered
// west-to-east by current UTC offset (mirrors how most timezone pickers group).
export function getAllTimezoneOptions(): TimezoneOption[] {
  const pinnedValues = new Set(COMMON_TIMEZONES.map((tz) => tz.value));

  const others = Intl.supportedValuesOf("timeZone")
    .filter((tz) => !pinnedValues.has(tz))
    .map((tz) => ({
      value: tz,
      label: tz === "UTC" ? "UTC" : getTimezoneLabel(tz),
      offset: getTimezoneOffsetMinutes(tz),
    }))
    .sort((a, b) => a.offset - b.offset || a.label.localeCompare(b.label))
    .map(({ value, label }) => ({ value, label }));

  return [...COMMON_TIMEZONES, ...others];
}

export function formatTimeInZone(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function clampAvailabilityRange(startMs: number, endMs: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = Math.max(startMs, today.getTime());
  const maxEndDate = startDate + 31 * 24 * 60 * 60 * 1000;
  const endDate = Math.min(Math.max(endMs, startDate), maxEndDate);

  return { startDate, endDate };
}

export function isBookableDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = new Date(today);
  min.setDate(min.getDate() + MIN_DAYS_OUT);
  const max = new Date(today);
  max.setDate(max.getDate() + MAX_DAYS_OUT);

  const day = new Date(date);
  day.setHours(0, 0, 0, 0);

  return day >= min && day <= max;
}

export function getFirstBookableDate(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + MIN_DAYS_OUT);
  return date;
}

export interface CalendarLinks {
  google: string;
  outlook: string;
  ics: string;
}

function toUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildCalendarLinks(
  startIso: string,
  durationMinutes: number,
  event: { title: string; details: string },
): CalendarLinks {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", event.title);
  google.searchParams.set("dates", `${toUtcStamp(start)}/${toUtcStamp(end)}`);
  google.searchParams.set("details", event.details);

  const outlook = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
  outlook.searchParams.set("path", "/calendar/action/compose");
  outlook.searchParams.set("rru", "addevent");
  outlook.searchParams.set("startdt", start.toISOString());
  outlook.searchParams.set("enddt", end.toISOString());
  outlook.searchParams.set("subject", event.title);
  outlook.searchParams.set("body", event.details);

  const icsBody = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Market Stack//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@marketstack.ai`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.details.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return {
    google: google.toString(),
    outlook: outlook.toString(),
    ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(icsBody)}`,
  };
}
