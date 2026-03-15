"use client";

import { cn } from "@/lib/utils";

/**
 * Shared responsive layout for dashboard main content.
 * - Reduces padding on mobile, consistent at sm/md/lg
 * - No horizontal scroll
 * - Safe area friendly
 */
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-x-hidden overflow-y-auto",
        "px-3 py-4 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-5",
        "min-h-0", // for flex children
        className
      )}
    >
      {children}
    </div>
  );
}
