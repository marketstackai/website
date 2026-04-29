import { ThemeToggle } from "../../ui/theme-toggle";
import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "../../ui/footer";
import { siteConfig } from "@/config/site";
import MarketStack from "../../logos/marketstack";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showThemeToggle?: boolean;
}

export default function FooterSection({
  columns = [
    {
      title: "Connect",
      links: [
        { text: "LinkedIn", href: siteConfig.links.linkedin },
        { text: "X / Twitter", href: siteConfig.links.twitter },
        { text: "GitHub", href: siteConfig.links.github },
      ],
    },
    {
      title: "Platform",
      links: [
        { text: "Services", href: "/services" },
        { text: "AI Audit", href: "/audit" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} Market Stack. All rights reserved`,
  policies = [
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Terms of Service", href: "/terms" },
  ],
  showThemeToggle = true,
}: FooterProps) {
  return (
    <footer className="bg-background w-full px-4">
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            {columns.map((column, index) => (
              <FooterColumn key={index}>
                <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                {column.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="text-muted-foreground text-sm"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.text}
                  </a>
                ))}
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
            <div className="flex items-center gap-4">
              {policies.map((policy, index) => (
                <a
                  key={index}
                  href={policy.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {policy.text}
                </a>
              ))}
              {showThemeToggle && <ThemeToggle type={"dropdown"} />}
              <MarketStack className="text-primary ml-2 size-6" />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
