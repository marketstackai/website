import { ThemeToggle } from "../../ui/theme-toggle";
import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "../../ui/footer";
import { siteConfig } from "@/config/site";

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
        { text: "LinkedIn", href: "https://www.linkedin.com/in/teddybenz" },
        { text: "X / Twitter", href: siteConfig.links.twitter },
        { text: "GitHub", href: "https://github.com/teddybenzdev" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} Market Stack. All rights reserved`,
  policies = [
    { text: "Privacy Policy", href: "/privacy-policy" },
    { text: "Terms of Service", href: "/terms-of-service" },
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
