import Image from "next/image";
import { cn } from "@/lib/utils";

interface ScreenshotProps {
  srcLight: string;
  srcDark?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function Screenshot({
  srcLight,
  srcDark,
  alt,
  width,
  height,
  className,
  priority,
}: ScreenshotProps) {
  const darkSrc = srcDark || srcLight;

  if (darkSrc === srcLight) {
    return (
      <Image
        src={srcLight}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <>
      <Image
        src={srcLight}
        alt={alt}
        width={width}
        height={height}
        className={cn(className, "dark:hidden")}
        priority={priority}
      />
      <Image
        src={darkSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(className, "hidden dark:block")}
        priority={priority}
      />
    </>
  );
}
