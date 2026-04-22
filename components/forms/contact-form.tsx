"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
  website: string;
  sms_consent: boolean;
  marketing_consent: boolean;
}

function standardizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return "";
  return `https://${url.replace(/^https?:\/\//, "")}`;
}

interface ContactFormProps {
  onSuccess: (data: ContactFormData) => void;
  submitLabel?: string;
  initialValues?: ContactFormData;
}

const OFFSCREEN: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: 1,
  height: 1,
  opacity: 0,
};

export function ContactForm({ onSuccess, submitLabel = "Next", initialValues }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>(
    initialValues ?? {
      first_name: "", last_name: "", email: "", phone: "", business_name: "", website: "",
      sms_consent: false, marketing_consent: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ghlEnabled, setGhlEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (process.env.NODE_ENV === "development") {
      const stored = localStorage.getItem("ms_ghl_enabled");
      if (stored === null) {
        localStorage.setItem("ms_ghl_enabled", "false");
        setGhlEnabled(false);
      } else {
        setGhlEnabled(stored === "true");
      }
    }
  }, []);

  const toggleGhl = () => {
    const next = !ghlEnabled;
    localStorage.setItem("ms_ghl_enabled", String(next));
    setGhlEnabled(next);
    window.location.reload();
  };

  const update = (patch: Partial<ContactFormData>) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(formData);
    }, 600);
  };

  const devAutofill = () => {
    const data: ContactFormData = {
      first_name: "Dev",
      last_name: "Test",
      email: "dev@marketstack.ai",
      phone: "1234567890",
      business_name: "Dev Test Co",
      website: "https://example.com",
      sms_consent: true,
      marketing_consent: true,
    };
    update(data);
  };

  return (
    <div className="relative group/form">
      <form name="contact" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <input required type="text" name="first_name" placeholder="e.g. John" className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden focus:border-brand"
                   value={formData.first_name} onChange={e => update({ first_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <input required type="text" name="last_name" placeholder="e.g. Smith" className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden focus:border-brand"
                   value={formData.last_name} onChange={e => update({ last_name: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Name</label>
          <input required type="text" name="company_name" placeholder="e.g. Market Stack" className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden focus:border-brand"
                 value={formData.business_name} onChange={e => update({ business_name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Website</label>
          <input required type="url" name="website" placeholder="e.g. marketstack.ai" className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden focus:border-brand"
                 value={formData.website} onChange={e => update({ website: e.target.value })}
                 onBlur={e => update({ website: standardizeUrl(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Email</label>
          <input required type="email" name="email" placeholder="e.g. john@marketstack.ai" className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden focus:border-brand"
                 value={formData.email} onChange={e => update({ email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input type="tel" name="phone" placeholder="e.g. (555) 000-0000" className="w-full bg-background border rounded-lg px-4 py-2.5 outline-hidden focus:border-brand"
                 value={formData.phone} onChange={e => update({ phone: e.target.value })} />
          <p className="text-xs text-muted-foreground">Add your number to receive your results via text</p>
        </div>
        <div className="space-y-4 pt-4">
          <input type="text" readOnly name="sms_consent" value={formData.sms_consent ? "Yes" : "No"} style={OFFSCREEN} tabIndex={-1} aria-hidden="true" />
          <input type="text" readOnly name="marketing_consent" value={formData.marketing_consent ? "Yes" : "No"} style={OFFSCREEN} tabIndex={-1} aria-hidden="true" />
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 size-4 accent-brand border-muted-foreground"
                   checked={formData.sms_consent} onChange={e => update({ sms_consent: e.target.checked })} />
            <span className="text-xs text-muted-foreground/90 leading-tight">
              I consent to receive non-marketing sms notifications and alerts from Market Stack. Message frequency varies. Message &amp; data rates may apply. Reply STOP to unsubscribe at any time.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 size-4 accent-brand border-muted-foreground"
                   checked={formData.marketing_consent} onChange={e => update({ marketing_consent: e.target.checked })} />
            <span className="text-xs text-muted-foreground/90 leading-tight">
              I consent to receive occasional marketing sms messages and offers from Market Stack. Message frequency varies. Message &amp; data rates may apply. Reply STOP to unsubscribe at any time.
            </span>
          </label>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        <div className="text-xs text-center text-muted-foreground font-medium opacity-60">
          <Link href="/privacy" className="hover:text-foreground transition-all duration-300 decoration-border">Privacy Policy</Link>
          <span className="mx-3 opacity-30">|</span>
          <Link href="/terms" className="hover:text-foreground transition-all duration-300 decoration-border">Terms of Service</Link>
        </div>
      </form>

      {mounted && process.env.NODE_ENV === "development" && createPortal(
        <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleGhl}
            className="opacity-80 hover:opacity-100 transition-all bg-background/80 backdrop-blur-md border-muted-foreground/20 shadow-xl flex items-center gap-2"
          >
            <input type="checkbox" checked={ghlEnabled} readOnly className="accent-brand pointer-events-none" />
            <span>GHL Tracking</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={devAutofill}
            className="opacity-80 hover:opacity-100 transition-all bg-background/80 backdrop-blur-md border-muted-foreground/20 shadow-xl"
          >
            Auto Fill
          </Button>
        </div>,
        document.body
      )}
    </div>
  );
}
