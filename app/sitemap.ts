import type { MetadataRoute } from "next";

const BASE = "https://marketstack.ai";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/audit`, changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/book`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.2 },
];

const serviceSpokes = [
  "ai-receptionist",
  "ai-conversational",
  "lead-reactivation",
  "reviews",
  "quotes",
  "booking-recovery",
  "agentic-workflows",
  "seo",
  "websites",
  "document-processing",
  "geo",
];

const industryHubs = [
  "home-services",
  "real-estate",
  "professional-services",
  "e-commerce",
  "tech-gtm",
  "lenders",
];

const landBuildNiches = [
  "land-clearing",
  "surveying",
  "soil-science",
  "manufactured-homes",
  "builders",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const spokes: MetadataRoute.Sitemap = serviceSpokes.map((slug) => ({
    url: `${BASE}/services/${slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const industries: MetadataRoute.Sitemap = [
    ...industryHubs,
    ...landBuildNiches,
  ].map((slug) => ({
    url: `${BASE}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...spokes, ...industries];
}
