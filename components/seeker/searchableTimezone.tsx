"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface TimezoneSearchableSelectProps {
  value?: string;
  onChange: (value: string) => void;
  timeZones: string[];
  placeholder?: string;
  className?: string;
}

export function TimezoneSearchableSelect({
  value,
  onChange,
  timeZones,
  placeholder = "Select timezone",
  className,
}: TimezoneSearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTimeZones = React.useMemo(() => {
    if (!searchQuery) return timeZones;
    const query = searchQuery.toLowerCase();
    return timeZones.filter((zone) =>
      zone.toLowerCase().includes(query)
    );
  }, [timeZones, searchQuery]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className={cn(
            "h-12 w-full justify-between border-2 rounded-[8px] border-[#D0D5DD] font-normal",
            !value && "text-gray-400",
            className
          )}
        >
          <span className="truncate text-left">
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] p-0"
      >
        {/* Search Input */}
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search timezone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Options */}
        <div className="max-h-[300px] overflow-y-auto p-1">
          {filteredTimeZones.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No timezone found.
            </div>
          ) : (
            filteredTimeZones.map((zone) => (
              <DropdownMenuItem
                key={zone}
                onSelect={() => {
                  onChange(zone);
                  setOpen(false);
                  setSearchQuery("");
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === zone ? "opacity-100" : "opacity-0"
                  )}
                />
                {zone}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}