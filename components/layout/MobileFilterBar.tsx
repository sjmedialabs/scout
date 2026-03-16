"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Renders a filter bar that on desktop shows all filters in one row,
 * and on mobile shows search (optional) + a "Filters" button that opens
 * a bottom sheet with all filter controls stacked. No horizontal scroll on mobile.
 */
interface MobileFilterBarProps {
  /** Optional search input/content - shown full width on mobile, first in row on desktop */
  searchSlot?: React.ReactNode;
  /** Filter controls (selects, dates, clear button). On mobile these go inside the sheet. */
  children: React.ReactNode;
  /** Optional number of active filters to show as badge on the Filters button */
  activeFilterCount?: number;
  /** Extra class for the outer wrapper */
  className?: string;
  /** Optional label for the sheet title (default "Filters") */
  sheetTitle?: string;
}

export function MobileFilterBar({
  searchSlot,
  children,
  activeFilterCount = 0,
  className,
  sheetTitle = "Filters",
}: MobileFilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: single row, no scroll */}
      <div className="hidden lg:block w-full overflow-x-auto">
  <div className="flex items-center gap-2 xl:gap-3 min-w-max">
    {searchSlot && (
      <div className="min-w-[200px] lg:min-w-[220px] max-w-[280px] shrink-0">
        {searchSlot}
      </div>
    )}
    {children}
  </div>
</div>

      {/* Mobile: search + Filters button; filters in sheet */}
      <div className="lg:hidden flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {searchSlot && <div className="w-full flex-1 min-w-0">{searchSlot}</div>}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="shrink-0 border border-[#D0D5DD] rounded-full gap-2 h-[35px] px-4 w-full sm:w-auto sm:min-w-[120px]"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#2C34A1] text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-auto max-h-[85vh] rounded-t-2xl pt-6 pb-8 px-0"
            >
              <SheetHeader className="sr-only px-6">
                <SheetTitle>{sheetTitle}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 pt-2 px-6 pb-6">
                {children}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
