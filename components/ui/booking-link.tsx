"use client";

import Link from "next/link";
import { setBookingIntent, setSourceIndustry } from "@/lib/booking";

interface BookingLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  interest?: string;
  source?: string;
  industry?: string;
}

export function BookingLink({
  interest,
  source,
  industry,
  onClick,
  children,
  ...props
}: BookingLinkProps) {
  return (
    <Link
      href="/book"
      onClick={(e) => {
        if (interest) setBookingIntent(interest, source);
        if (industry) setSourceIndustry(industry);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
