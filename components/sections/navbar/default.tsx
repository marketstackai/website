import { Button, type ButtonProps } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import { ThemeToggle } from "../../ui/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { Menu, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ReactNode } from "react";

import MarketStack from "../../logos/marketstack";
import Navigation from "../../ui/navigation";

import { peaceSans } from "@/lib/fonts";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

const SERVICES_LINKS = [
  { title: "The Stack", href: "/services#stack", description: "Automation for your specific needs." },
  { title: "Train", href: "/services#train", description: "Fast-track your team with AI workshops." },
  { title: "Strategize", href: "/services#strategize", description: "Map your bottlenecks and build strategy." },
  { title: "Build", href: "/services#build", description: "Custom software and AI engineering." },
];

const INDUSTRIES_LINKS = [
  { title: "Home Services", href: "/home-services", description: "HVAC, roofing, plumbing, trades" },
  { title: "Real Estate", href: "/real-estate", description: "Brokerages, agents, investors" },
  { title: "Lenders", href: "/lenders", description: "Construction and land lending" },
  { title: "Professional Services", href: "/professional-services", description: "Law, accounting, consulting" },
  { title: "E-Commerce", href: "/e-commerce", description: "DTC brands, Shopify operators" },
  { title: "Tech & SaaS GTM", href: "/tech-gtm", description: "B2B SaaS and RevOps teams" },
  { title: "Land Clearing & Grading", href: "/land-clearing", description: "Clearing and grading operators" },
  { title: "Surveying", href: "/surveying", description: "Land surveyors" },
  { title: "Soil Science", href: "/soil-science", description: "Geotechnical specialists" },
  { title: "Builders", href: "/builders", description: "Custom and production builders" },
  { title: "Manufactured Homes", href: "/manufactured-homes", description: "Dealers and installers" },
];

const servicesContent = (
  <div className="grid p-4 md:w-[450px] lg:w-[500px] md:grid-cols-[.75fr_1fr] gap-3">
    <div className="md:row-span-3">
      <Link
        href="/services#stack"
        className="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-muted/30 to-muted/10 p-6 no-underline outline-hidden select-none hover:bg-accent/50 transition-colors"
      >
        <MarketStack />
        <div className="mt-4 mb-2 text-lg font-medium">The Stack</div>
        <p className="text-muted-foreground text-sm leading-tight">
          Automation for your specific needs. Built for modern operators.
        </p>
      </Link>
    </div>
    {SERVICES_LINKS.slice(1).map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="block rounded-md p-3 hover:bg-accent transition-colors"
      >
        <p className="text-sm font-medium leading-none mb-1">{item.title}</p>
        <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{item.description}</p>
      </Link>
    ))}
  </div>
);

const industriesContent = (
  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[580px] grid-cols-2">
    <div>
      {INDUSTRIES_LINKS.slice(0, 6).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-md px-3 py-2 hover:bg-accent transition-colors"
        >
          <p className="text-sm font-medium leading-none">{item.title}</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{item.description}</p>
        </Link>
      ))}
    </div>
    <div>
      {INDUSTRIES_LINKS.slice(6).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="block rounded-md px-3 py-2 hover:bg-accent transition-colors"
        >
          <p className="text-sm font-medium leading-none">{item.title}</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{item.description}</p>
        </Link>
      ))}
    </div>
  </div>
);


export default function Navbar({
  logo = <MarketStack />,
  name = "MARKET STACK",
  homeUrl = "/",
  actions = [
    {
      text: "AI Audit",
      href: siteConfig.auditUrl,
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 -mb-4 px-4 pb-4">
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            {isInternalHref(homeUrl) ? (
              <Link
                href={homeUrl}
                className={`${peaceSans.className} text-primary flex items-center gap-2 lg:text-lg`}
              >
                {logo}
                {name}
              </Link>
            ) : (
              <a
                href={homeUrl}
                className={`${peaceSans.className} text-primary flex items-center gap-2 lg:text-lg`}
              >
                {logo}
                {name}
              </a>
            )}
            <div className="ml-4 hidden md:block">
              <Navigation
                menuItems={[
                  {
                    title: "Services",
                    content: servicesContent,
                  },
                  {
                    title: "Industries",
                    content: industriesContent,
                  },
                ]}
              />
            </div>
            {showNavigation && customNavigation}
          </NavbarLeft>
          <NavbarRight>
            <ThemeToggle type={"icon"} />
            {actions.map((action, index) =>
              action.isButton ? (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  className="hidden text-sm md:block"
                  asChild
                >
                  {isInternalHref(action.href) ? (
                    <Link href={action.href}>
                      {action.icon}
                      {action.text}
                      {action.iconRight}
                    </Link>
                  ) : (
                    <a href={action.href}>
                      {action.icon}
                      {action.text}
                      {action.iconRight}
                    </a>
                  )}
                </Button>
              ) : isInternalHref(action.href) ? (
                <Link
                  key={index}
                  href={action.href}
                  className="text-muted-foreground hover:text-foreground hidden  cursor-pointer text-sm font-medium transition-colors md:flex"
                >
                  {action.text}
                </Link>
              ) : (
                <a
                  key={index}
                  href={action.href}
                  className="text-muted-foreground hover:text-foreground hidden cursor-pointer text-sm font-medium transition-colors md:flex"
                >
                  {action.text}
                </a>
              ),
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:max-w-md overflow-y-auto" aria-describedby={undefined}>
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">Site navigation links</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-6 mt-6 pb-8">
                  {/* Services group */}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1">
                      Services
                    </p>
                    {SERVICES_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex flex-col rounded-lg px-3 py-3 hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{link.title}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{link.description}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="h-px bg-border" />

                  {/* Industries group */}
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-1">
                      Industries
                    </p>
                    {INDUSTRIES_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex flex-col rounded-lg px-3 py-3 hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{link.title}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{link.description}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="h-px bg-border" />

                  {/* Primary CTA */}
                  <Button size="lg" asChild className="w-full">
                    {isInternalHref(siteConfig.auditUrl) ? (
                      <Link href={siteConfig.auditUrl} className="flex items-center gap-1">
                        Start Your AI Audit
                        <ArrowUpRight className="size-4" />
                      </Link>
                    ) : (
                      <a href={siteConfig.auditUrl} className="flex items-center gap-1">
                        Start Your AI Audit
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
