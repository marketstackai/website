export const CALENDAR_ID = "3kaQEdii0FF1El7xKgWY";

// Mirrors the calendar's own booking-window config in GHL
// (allowBookingAfter / allowBookingFor).
export const MIN_DAYS_OUT = 2;
export const MAX_DAYS_OUT = 20;

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
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
