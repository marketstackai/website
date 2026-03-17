import { ThemeToggle } from "../../ui/theme-toggle";
import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "../../ui/footer";
import MarketStack from "../../logos/marketstack";
import { siteConfig } from "@/config/site";
import { ReactNode } from "react";

import { peaceSans } from "@/lib/fonts";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showThemeToggle?: boolean;
}

export default function FooterSection({
  logo = <MarketStack />,
  name = "MARKET STACK",
  columns = [
    {
      title: "Services",
      links: [
        { text: "Pipeline Automation", href: "/#services" },
        { text: "AI Agents", href: "/#services" },
        { text: "Process Mapping", href: "/#services" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", href: "/#about" },
        { text: "Audit", href: siteConfig.auditUrl },
        { text: "Contact", href: siteConfig.links.email },
      ],
    },
    {
      title: "Connect",
      links: [
        { text: "LinkedIn", href: siteConfig.links.linkedin },
        { text: "X / Twitter", href: siteConfig.links.twitter },
        { text: "Email", href: siteConfig.links.email },
      ],
    },
  ],
  copyright = "© 2025 Market Stack. All rights reserved",
  policies = [
    { text: "Privacy Policy", href: "#" },
    { text: "Terms of Service", href: "#" },
  ],
  showThemeToggle = true,
}: FooterProps) {
  return (
    <footer className="bg-background w-full px-4">
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <a href="/" className={`${peaceSans.className} text-primary flex items-center gap-2 lg:text-lg`}>
                {logo}
                {name}
              </a>
            </FooterColumn>
            {columns.map((column, index) => (
              <FooterColumn key={index}>
                <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                {column.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.href}
                    className="text-muted-foreground text-sm"
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
                <a key={index} href={policy.href}>
                  {policy.text}
                </a>
              ))}
              {showThemeToggle && <ThemeToggle type={"dropdown"} />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
