"use client";

import Link from "next/link";
import { setSourceIndustry, setBookingIntent } from "@/lib/booking";

interface AuditLinkProps
  extends Omit<React.ComponentProps<typeof Link>, "href"> {
  industry?: string;
  interest?: string;
}

export function AuditLink({ industry, interest, onClick, children, ...props }: AuditLinkProps) {
  return (
    <Link
      href="/audit/start"
      onClick={(e) => {
        if (industry) setSourceIndustry(industry);
        if (interest) setBookingIntent(interest);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
