export type BookingInterest =
  | "kit"
  | "os"
  | "studio"
  | "workshop"
  | "rolesprint"
  | "bootcamp"
  | "stackaudit"
  | "opsaudit"
  | "growthplan"
  | "aireceptionist"
  | "speedtolead"
  | "workflow"
  | "frontoffice"
  | "webchat"
  | "aiconversational"
  | "reviews"
  | "bookingrecovery"
  | "website"
  | "agentic"
  | "seo"
  | "geo"
  | "documentprocessing"
  | "quotefollowup"
  | "reactivation";

export const INTEREST_SUBHEADINGS: Record<BookingInterest, string> = {
  kit: "Schedule a time to discuss the Foundation Kit.",
  os: "Let’s get your Operating System deployed.",
  studio: "Tell us about your project.",
  workshop: "Let’s plan your AI Workshop.",
  rolesprint: "Let’s scope your Role-Based AI Sprint.",
  bootcamp: "Let’s design your AI Bootcamp.",
  stackaudit: "Book your Stack Audit — $500 credits toward any project.",
  opsaudit: "Let’s scope your AI Operations Audit.",
  growthplan: "Let’s map your AI Growth Infrastructure Plan.",
  aireceptionist: "Let’s set up your AI Receptionist.",
  speedtolead: "Let’s build your Speed-to-Lead system.",
  workflow: "Let’s scope your custom workflow.",
  frontoffice: "Let’s explore how your AI Front Office system will look.",
  webchat: "Let’s set up your AI Web Chat.",
  aiconversational: "Let’s scope your conversational AI build.",
  reviews: "Let’s automate your review generation.",
  bookingrecovery: "Let’s recover your missed bookings.",
  website: "Let’s build your conversion-focused website.",
  agentic: "Tell us about your custom workflow challenge.",
  seo: "Let’s optimize your local search presence.",
  geo: "Let’s optimize for AI-powered search.",
  documentprocessing: "Let’s scope your document automation.",
  quotefollowup: "Let’s build your quote follow-up system.",
  reactivation: "Let’s re-engage your dormant leads.",
};

const STORAGE_KEY_INTEREST = "ms_interest";
const STORAGE_KEY_SOURCE = "ms_booking_source";
export const STORAGE_KEY_INDUSTRY = "ms_industry";

export function setBookingIntent(interest: string, source?: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_INTEREST, interest);
    if (source) {
      sessionStorage.setItem(STORAGE_KEY_SOURCE, source);
    } else {
      sessionStorage.removeItem(STORAGE_KEY_SOURCE);
    }
  } catch {
    // SSR or storage unavailable — silently skip
  }
}

export function getBookingIntent(): {
  interest: string | null;
  source: string | null;
} {
  try {
    return {
      interest: sessionStorage.getItem(STORAGE_KEY_INTEREST),
      source: sessionStorage.getItem(STORAGE_KEY_SOURCE),
    };
  } catch {
    return { interest: null, source: null };
  }
}

export function setSourceIndustry(industry: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY_INDUSTRY, industry);
  } catch {
    // SSR or storage unavailable — silently skip
  }
}

export function getSourceIndustry(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY_INDUSTRY);
  } catch {
    return null;
  }
}

export function clearSourceIndustry(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY_INDUSTRY);
  } catch {
    // silently skip
  }
}
