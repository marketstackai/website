"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import MarketStack from "../logos/marketstack";
import { siteConfig } from "@/config/site";
import { ReactNode } from "react";

interface ComponentItem {
  title: string;
  href: string;
  description: string;
}

interface MenuItem {
  title: string;
  href?: string;
  isLink?: boolean;
  content?: ReactNode;
}

interface NavigationProps {
  menuItems?: MenuItem[];
  components?: ComponentItem[];
  logo?: ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: {
    title: string;
    href: string;
    description: string;
  }[];
}

export default function Navigation({
  menuItems = [
    {
      title: "Services",
      content: "default",
    },
    {
      title: "About",
      isLink: true,
      href: "/#about",
    },
    {
      title: "Audit",
      isLink: true,
      href: siteConfig.auditUrl,
    },
  ],
  logo = <MarketStack />,
  logoTitle = "Market Stack",
  logoDescription = "AI-powered systems and agentic workflows that streamline pipelines and eliminate bottlenecks for small businesses.",
  logoHref = "/",
  introItems = [
    {
      title: "Pipeline Automation",
      href: "/#services",
      description:
        "End-to-end automation from intake to delivery — no manual handoffs.",
    },
    {
      title: "AI Agent Deployment",
      href: "/#services",
      description:
        "Autonomous agents that execute multi-step processes while you sleep.",
    },
    {
      title: "Process Optimization",
      href: "/#services",
      description:
        "Map, measure, and eliminate every bottleneck in your operations.",
    },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={item.href || ""}>
                  {item.title}
                </Link>
              </NavigationMenuLink>
            ) : (
              <>
                {item.href ? (
                  <Link href={item.href}>
                    <NavigationMenuTrigger className="cursor-pointer">
                      {item.title}
                    </NavigationMenuTrigger>
                  </Link>
                ) : (
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                )}
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-muted/30 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href={logoHref}
                          >
                            {logo}
                            <div className="mt-4 mb-2 text-lg font-medium">
                              {logoTitle}
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              {logoDescription}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((intro, i) => (
                        <ListItem
                          key={i}
                          href={intro.href}
                          title={intro.title}
                        >
                          {intro.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
