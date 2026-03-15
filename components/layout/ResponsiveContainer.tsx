"use client";

import { cn } from "@/lib/utils";

/**
 * Responsive container: mobile-first, max-width at breakpoints, consistent padding.
 * Prevents horizontal scroll and scales typography/spacing.
 * Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536
 */
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  /** If true, uses full width (no max-width). Default false. */
  fullWidth?: boolean;
}

export function ResponsiveContainer({
  children,
  className,
  fullWidth = false,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        "px-3 sm:px-4 md:px-5 lg:px-6",
        !fullWidth && "max-w-[1536px]",
        className
      )}
    >
      {children}
    </div>
  );
}
