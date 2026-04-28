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
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import { Menu } from "lucide-react";
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

const servicesContent = (
  <div className="grid p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] gap-3">
    <div className="row-span-3">
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
    {[
      { title: "Train", href: "/services#train", description: "Fast-track your team with highly actionable AI workshops." },
      { title: "Strategize", href: "/services#strategize", description: "Map your bottlenecks and create custom strategy." },
      { title: "Build", href: "/services#build", description: "Full-scale custom software development and AI engineering." },
    ].map((item) => (
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
  <div className="grid gap-2 p-4 md:w-[500px] lg:w-[580px] lg:grid-cols-2">
    <div>
      {[
        { title: "Home Services", href: "/home-services", description: "HVAC, roofing, plumbing, trades" },
        { title: "Real Estate", href: "/real-estate", description: "Brokerages, agents, investors" },
        { title: "Lenders", href: "/lenders", description: "Construction and land lending" },
        { title: "Professional Services", href: "/professional-services", description: "Law, accounting, consulting" },
        { title: "E-Commerce", href: "/e-commerce", description: "DTC brands, Shopify operators" },
        { title: "Tech & SaaS GTM", href: "/tech-gtm", description: "B2B SaaS and RevOps teams" },
      ].map((item) => (
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
      {[
        { title: "Land Clearing & Grading", href: "/land-clearing", description: "Clearing and grading operators" },
        { title: "Surveying", href: "/surveying", description: "Land surveyors" },
        { title: "Soil Science", href: "/soil-science", description: "Geotechnical specialists" },
        { title: "Builders", href: "/builders", description: "Custom and production builders" },
        { title: "Manufactured Homes", href: "/manufactured-homes", description: "Dealers and installers" },
      ].map((item) => (
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
  mobileLinks = [
    { text: "Services", href: "/services" },
    { text: "Home Services", href: "/home-services" },
    { text: "Real Estate", href: "/real-estate" },
    { text: "Lenders", href: "/lenders" },
    { text: "Professional Services", href: "/professional-services" },
    { text: "Land Clearing & Grading", href: "/land-clearing" },
    { text: "Builders", href: "/builders" },
    { text: "AI Audit", href: "/audit" },
  ],
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
                  className="text-muted-foreground hover:text-foreground hidden cursor-pointer text-sm font-medium transition-colors md:flex"
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
            {mobileLinks.length > 0 && (
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
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="grid gap-4 text-lg font-medium mt-6">
                    {isInternalHref(homeUrl) ? (
                      <Link
                        href={homeUrl}
                        className="flex items-center gap-2 text-xl font-bold"
                      ></Link>
                    ) : (
                      <a
                        href={homeUrl}
                        className="flex items-center gap-2 text-xl font-bold"
                      ></a>
                    )}
                    {mobileLinks.map((link, index) =>
                      isInternalHref(link.href) ? (
                        <Link
                          key={index}
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {link.text}
                        </Link>
                      ) : (
                        <a
                          key={index}
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {link.text}
                        </a>
                      ),
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
