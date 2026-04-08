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
  | "frontoffice";

export const INTEREST_SUBHEADINGS: Record<BookingInterest, string> = {
  kit: "Schedule a time to discuss the Foundation Kit.",
  os: "Let\u2019s get your Operating System deployed.",
  studio: "Tell us about your project in a discovery call.",
  workshop: "Let\u2019s plan your AI Starter Workshop.",
  rolesprint: "Let\u2019s scope your Role-Based AI Sprint.",
  bootcamp: "Let\u2019s design your AI Bootcamp program.",
  stackaudit: "Book your Stack Audit \u2014 $500 credits toward any project.",
  opsaudit: "Let\u2019s scope your AI Operations Audit.",
  growthplan: "Let\u2019s map your AI Growth Infrastructure Plan.",
  aireceptionist: "Let\u2019s set up your AI Receptionist.",
  speedtolead: "Let\u2019s build your Speed-to-Lead system.",
  workflow: "Let\u2019s scope your custom workflow automation.",
  frontoffice: "Let\u2019s explore the AI Front Office system.",
};

const STORAGE_KEY_INTEREST = "ms_booking_interest";
const STORAGE_KEY_SOURCE = "ms_booking_source";

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
