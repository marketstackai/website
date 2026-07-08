"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { getDefaultClassNames } from "react-day-picker";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/sections/navbar/default";
import Footer from "@/components/sections/footer/default";
import Glow from "@/components/ui/glow";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getBookingIntent, INTEREST_SUBHEADINGS } from "@/lib/booking";
import { getBrowserTimezone, getFirstBookableDate, isBookableDay } from "@/lib/calendar";

const DEFAULT_SUBHEADING =
  "Pick a time that works for you. We’ll handle the rest.";

const rdpDefaultClassNames = getDefaultClassNames();

type View = "calendar" | "form" | "success";

export default function BookingCalendar() {
  const searchParams = useSearchParams();

  const interestRef = useRef<string | null>(null);
  const sourceRef = useRef<string | null>(null);
  const industryRef = useRef<string | null>(null);
  const [subheading, setSubheading] = useState(DEFAULT_SUBHEADING);

  useEffect(() => {
    const intent = getBookingIntent();
    const storedIndustry = (() => {
      try {
        return sessionStorage.getItem("ms_industry");
      } catch {
        return null;
      }
    })();

    const resolvedInterest = intent.interest || searchParams.get("interest") || searchParams.get("ref");
    const resolvedSource = intent.source || searchParams.get("source");
    const resolvedIndustry = storedIndustry || searchParams.get("industry");

    interestRef.current = resolvedInterest;
    sourceRef.current = resolvedSource;
    industryRef.current = resolvedIndustry;

    if (resolvedInterest && INTEREST_SUBHEADINGS[resolvedInterest as keyof typeof INTEREST_SUBHEADINGS]) {
      setSubheading(INTEREST_SUBHEADINGS[resolvedInterest as keyof typeof INTEREST_SUBHEADINGS]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setView] = useState<View>("calendar");
  const [month, setMonth] = useState<Date>(getFirstBookableDate());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(getFirstBookableDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<string, string[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const didAutoSelectRef = useRef(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      setLoadingSlots(true);
      setSlotsError(null);
      try {
        const timezone = getBrowserTimezone();
        const params = new URLSearchParams({
          startDate: String(startOfMonth(month).getTime()),
          endDate: String(endOfMonth(month).getTime()),
          timezone,
        });
        const res = await fetch(`/api/booking/slots?${params}`);
        const data = (await res.json()) as { success: boolean; slots?: Record<string, string[]>; error?: string };
        if (cancelled) return;
        if (!data.success || !data.slots) {
          setSlotsError(data.error ?? "Failed to load availability");
          setSlots({});
        } else {
          setSlots(data.slots);
        }
      } catch {
        if (!cancelled) {
          setSlotsError("Failed to load availability");
          setSlots({});
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [month]);

  const availableSlotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return slots[dateKey] ?? [];
  }, [slots, selectedDate]);

  const isDaySelectable = useCallback(
    (d: Date) => {
      if (!isBookableDay(d)) return false;
      if (loadingSlots) return true;
      const key = format(d, "yyyy-MM-dd");
      return (slots[key]?.length ?? 0) > 0;
    },
    [slots, loadingSlots],
  );

  // If the default guessed date turns out to have no slots once real
  // availability loads, jump to the earliest day that actually has one —
  // resolved before first paint of the calendar so there's no visible jump.
  useEffect(() => {
    if (didAutoSelectRef.current || loadingSlots) return;
    didAutoSelectRef.current = true;

    const keys = Object.keys(slots).sort();
    const currentKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
    const currentHasSlots = currentKey ? (slots[currentKey]?.length ?? 0) > 0 : false;

    if (!currentHasSlots && keys.length > 0) {
      setSelectedDate(parseISO(keys[0]));
    }
    setInitialLoadDone(true);
  }, [slots, loadingSlots, selectedDate]);

  function resetAll() {
    setView("calendar");
    setSelectedSlot(null);
    setSubmitError(null);
  }

  async function handleBookingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) return;

    const formData = new FormData(e.currentTarget);
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          notes: formData.get("notes"),
          consent: formData.get("consent") === "on",
          slot: selectedSlot,
          timezone: getBrowserTimezone(),
          interest: interestRef.current ?? undefined,
          source: sourceRef.current ?? undefined,
          industry: industryRef.current ?? undefined,
          gclid: searchParams.get("gclid") ?? undefined,
          fbclid: searchParams.get("fbclid") ?? undefined,
        }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) {
        setSubmitError(data.error ?? "Booking failed. Please try again.");
        return;
      }
      setView("success");
    } catch {
      setSubmitError("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-container mx-auto px-4 pt-16 pb-24 sm:pt-32 relative overflow-hidden">
        <div className="text-center mb-6 animate-appear">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Book a Call</h1>
          <p className="text-muted-foreground text-lg max-w-[540px] mx-auto text-balance">
            {subheading}
          </p>
        </div>

        <div
          className={cn(
            "relative mx-auto animate-appear [animation-delay:100ms]",
            view === "calendar" ? "max-w-4xl" : "max-w-md",
          )}
        >
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
            {view === "calendar" && (
              !initialLoadDone ? (
                <div className="flex items-center justify-center min-h-[420px]">
                  <Loader2 className="w-6 h-6 animate-spin text-brand" />
                </div>
              ) : (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                <div className="flex justify-center lg:justify-start lg:shrink-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => {
                      if (d) setSelectedDate(d);
                    }}
                    onMonthChange={setMonth}
                    disabled={(d) => !isDaySelectable(d)}
                    className="rounded-xl border border-border bg-background/50 p-2 sm:p-4 [--cell-size:clamp(2rem,9vw,3.5rem)]"
                    classNames={{
                      day: cn(
                        "group/day relative aspect-square h-full w-full select-none p-1",
                        rdpDefaultClassNames.day,
                      ),
                      today: "",
                    }}
                    components={{
                      DayButton: ({ className, modifiers, ...props }) => (
                        <CalendarDayButton
                          modifiers={modifiers}
                          className={cn(
                            "rounded-full border-transparent border transition-colors min-w-0 size-[clamp(2rem,9vw,3.5rem)]",
                            modifiers.today && "bg-accent",
                            modifiers.disabled
                              ? "text-muted-foreground hover:bg-transparent"
                              : cn(
                                  !modifiers.today && "border-border",
                                  "hover:border-brand hover:bg-brand/10 hover:text-brand",
                                ),
                            className,
                          )}
                          {...props}
                        />
                      ),
                    }}
                  />
                </div>

                <div className="lg:flex-1 lg:min-w-0 lg:border-l lg:border-border lg:pl-8 pt-6 lg:pt-0 border-t lg:border-t-0 border-border">
                  <h3 className="font-medium mb-4 text-xs text-muted-foreground uppercase tracking-wider text-center lg:text-left">
                    {selectedDate ? format(selectedDate, "MMMM d") : "Available Times"}
                  </h3>

                  {loadingSlots ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-brand" />
                    </div>
                  ) : slotsError ? (
                    <div className="text-center py-6 text-sm text-destructive">{slotsError}</div>
                  ) : availableSlotsForDate.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlotsForDate.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedSlot(slot);
                            setView("form");
                          }}
                          className="p-3 text-sm font-medium border border-border rounded-xl hover:border-brand hover:bg-brand/10 hover:text-brand transition-all focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {format(parseISO(slot), "h:mm a")}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No available times for this date.
                    </div>
                  )}
                </div>
              </div>
              )
            )}

            {view === "form" && selectedSlot && (
              <form onSubmit={handleBookingSubmit} className="animate-appear">
                <div className="mb-6 text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                    {selectedDate ? format(selectedDate, "MMMM d") : ""} &middot;{" "}
                    {format(parseISO(selectedSlot), "h:mm a")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setView("calendar")}
                    className="text-xs text-brand hover:underline"
                  >
                    Change time
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Anything you would like us to know before our call"
                    />
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <Checkbox id="consent" name="consent" className="mt-0.5" />
                    <Label htmlFor="consent" className="font-normal text-xs text-muted-foreground leading-snug">
                      I confirm that I want to receive content from Market Stack using any
                      contact information I provide.
                    </Label>
                  </div>
                </div>

                {submitError && (
                  <p className="mt-4 text-sm text-destructive text-center">{submitError}</p>
                )}

                <Button type="submit" disabled={submitting} className="w-full mt-6">
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Book Meeting"
                  )}
                </Button>
              </form>
            )}

            {view === "success" && (
              <div className="text-center py-8 animate-appear">
                <h2 className="text-xl font-semibold mb-2">Call Scheduled</h2>
                <p className="text-muted-foreground mb-6 text-balance">
                  We&apos;ve sent a confirmation with your meeting link. Talk soon!
                </p>
                <Button variant="outline" onClick={resetAll}>
                  Book Another
                </Button>
              </div>
            )}
          </div>
        </div>

        <Glow variant="bottom" className="opacity-40 scale-x-75 pointer-events-none" />
      </div>
      <Footer />
    </main>
  );
}
