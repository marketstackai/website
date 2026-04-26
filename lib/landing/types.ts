export interface ProblemItem {
  heading: string;
  body: string;
}

export interface OutcomeItem {
  heading: string;
  body: string;
}

export interface ROIMetric {
  label: string;
  value: string;
  sub?: string;
}

export interface CrossLink {
  label: string;
  href: string;
  description: string;
}

export type LandingCtaType = "audit" | "demo";

export interface LandingPageCopy {
  hero: {
    eyebrow?: string;
    headline: string;
    subhead: string;
    ctaType: LandingCtaType;
    industry?: string;
    interest?: string;
    primaryCtaLabel?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    secondaryCtaInterest?: string;
  };
  problems: {
    sectionHeading: string;
    items: ProblemItem[];
  };
  outcomes: {
    sectionHeading: string;
    items: OutcomeItem[];
  };
  roi: {
    sectionHeading: string;
    scenario: string;
    metrics: ROIMetric[];
  };
  crossLinks?: CrossLink[];
}
