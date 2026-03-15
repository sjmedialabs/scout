"use client";

import { cn } from "@/lib/utils";

/**
 * Responsive grid: 1 col mobile, then 2, 3, 4 cols at sm/md/lg.
 * Use for cards, stats, form groups.
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  /** Columns at sm (default 2) */
  colsSm?: 1 | 2 | 3 | 4;
  /** Columns at md (default 2 or 3) */
  colsMd?: 1 | 2 | 3 | 4;
  /** Columns at lg (default 3 or 4) */
  colsLg?: 1 | 2 | 3 | 4;
  /** Gap: default gap-3 sm:gap-4 */
  gap?: "gap-2" | "gap-3" | "gap-4" | "gap-6";
}

const gapMap = {
  "gap-2": "gap-2",
  "gap-3": "gap-3",
  "gap-4": "gap-4",
  "gap-6": "gap-6",
};

const colsMap = {
  1: "grid-cols-1",
  2: "sm:grid-cols-2",
  3: "md:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function ResponsiveGrid({
  children,
  className,
  colsSm = 2,
  colsMd = 2,
  colsLg = 3,
  gap = "gap-3",
}: ResponsiveGridProps) {
  const smClass =
    colsSm === 1 ? "" : colsSm === 2 ? "sm:grid-cols-2" : colsSm === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4";
  const mdClass =
    colsMd === 1 ? "" : colsMd === 2 ? "md:grid-cols-2" : colsMd === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  const lgClass =
    colsLg === 1 ? "" : colsLg === 2 ? "lg:grid-cols-2" : colsLg === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";

  return (
    <div
      className={cn(
        "grid grid-cols-1",
        smClass,
        mdClass,
        lgClass,
        gapMap[gap],
        "sm:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}
