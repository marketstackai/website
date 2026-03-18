import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  image: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  version?: string;
  width?: number;
  height?: number;
  showName?: boolean;
  badge?: string;
}

export default function Logo({
  className,
  image: SvgImage,
  name,
  version,
  width = 24,
  height = 24,
  showName = true,
  badge,
  ...props
}: LogoProps) {
  return (
    <div
      data-slot="logo"
      className={cn("flex items-center gap-2 text-sm sm:text-lg font-medium", className)}
      {...props}
    >
      <div className="size-6 sm:size-8 flex items-center justify-center opacity-70">
        <SvgImage
          width={width}
          height={height}
          aria-hidden="true"
          className="size-full"
        />
      </div>
      <span className={cn(!showName && "sr-only")}>{name}</span>
      {version && <span className="text-muted-foreground">{version}</span>}
      {badge && (
        <Badge variant="brand" size="sm">
          {badge}
        </Badge>
      )}
    </div>
  );
}
