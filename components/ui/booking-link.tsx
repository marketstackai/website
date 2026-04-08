"use client";

import Link from "next/link";
import { setBookingIntent } from "@/lib/booking";

interface BookingLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  interest: string;
  source?: string;
}

export function BookingLink({
  interest,
  source,
  onClick,
  children,
  ...props
}: BookingLinkProps) {
  return (
    <Link
      href="/book"
      onClick={(e) => {
        setBookingIntent(interest, source);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
