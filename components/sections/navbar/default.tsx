import { Button, type ButtonProps } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import { ThemeToggle } from "../../ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../../ui/sheet";
import { Menu } from "lucide-react";
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

export default function Navbar({
  logo = <MarketStack />,
  name = "MARKET STACK",
  homeUrl = "/",
  mobileLinks = [
    { text: "Services", href: "/services#stack" },
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
            <a
              href={homeUrl}
              className={`${peaceSans.className} text-primary flex items-center gap-2 lg:text-lg`}
            >
              {logo}
              {name}
            </a>
            <div className="hidden ml-4 md:block">
              <Navigation 
                menuItems={[
                  {
                    title: "Services",
                    content: "default",
                    href: "/services#stack",
                  }
                ]}
                logoTitle="The Stack"
                logoDescription="Your entire revenue engine running on autopilot. Built for modern operators."
                logoHref="/services#stack"
                introItems={[
                  {
                    title: "Train",
                    href: "/services#train",
                    description: "Fast-track your team with highly actionable AI workshops."
                  },
                  {
                    title: "Strategize",
                    href: "/services#strategize",
                    description: "Map your bottlenecks and create custom strategy."
                  },
                  {
                    title: "Build",
                    href: "/services#build",
                    description: "Full-scale custom software development and AI engineering."
                  }
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
                  <a href={action.href}>
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </a>
                </Button>
              ) : (
                <a
                  key={index}
                  href={action.href}
                  className="hidden text-sm font-medium cursor-pointer text-muted-foreground transition-colors hover:text-foreground md:flex"
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
                  <nav className="grid gap-6 text-lg font-medium">
                    <a
                      href={homeUrl}
                      className="flex items-center gap-2 text-xl font-bold"
                    >
                    </a>
                    {mobileLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {link.text}
                      </a>
                    ))}
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
