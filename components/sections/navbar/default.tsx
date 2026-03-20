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
  mobileLinks = [],
  actions = [
    {
      text: "Book an Audit",
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
                  className="hidden text-sm md:block"
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
