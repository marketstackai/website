import { ThemeToggle } from "../../ui/theme-toggle";
import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "../../ui/footer";
import LaunchUI from "../../logos/launch-ui";
import { siteConfig } from "@/config/site";
import { ReactNode } from "react";

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
  logo = <LaunchUI />,
  name = "Launch UI",
  columns = [
    {
      title: "Product",
      links: [
        { text: "Changelog", href: siteConfig.url },
        { text: "Documentation", href: siteConfig.url },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", href: siteConfig.url },
        { text: "Careers", href: siteConfig.url },
        { text: "Blog", href: siteConfig.url },
      ],
    },
    {
      title: "Contact",
      links: [
        { text: "Discord", href: siteConfig.url },
        { text: "Twitter", href: siteConfig.url },
        { text: "Github", href: siteConfig.links.github },
      ],
    },
  ],
  copyright = "© 2025 Mikołaj Dobrucki. All rights reserved",
  policies = [
    { text: "Privacy Policy", href: siteConfig.url },
    { text: "Terms of Service", href: siteConfig.url },
  ],
  showThemeToggle = true,
}: FooterProps) {
  return (
    <footer className="bg-background w-full px-4">
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                {logo}
                <h3 className="text-xl font-bold">{name}</h3>
              </div>
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
              {showThemeToggle && <ThemeToggle type={"dropdown"}/>}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
