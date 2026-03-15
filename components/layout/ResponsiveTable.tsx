"use client";

import { cn } from "@/lib/utils";

/**
 * Responsive table wrapper:
 * - Desktop: normal table
 * - Mobile: horizontal scroll so table doesn't break layout, or use card layout via children
 * Use overflow-x-auto for tables that must stay as tables on small screens.
 */
interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
  /** Wrap table in horizontal scroll on small screens. Default true. */
  scrollOnMobile?: boolean;
}

export function ResponsiveTable({
  children,
  className,
  scrollOnMobile = true,
}: ResponsiveTableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden",
        scrollOnMobile && "overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 [scrollbar-width:thin]",
        className
      )}
    >
      <div className={cn(scrollOnMobile && "min-w-[600px]")}>{children}</div>
    </div>
  );
}

/**
 * Use this to render a table as stacked cards on small screens and table on md+.
 * Pass table element and a card render function per row.
 */
interface ResponsiveTableOrCardsProps<T> {
  data: T[];
  columns: { key: string; label: string; className?: string }[];
  renderRow: (item: T) => React.ReactNode;
  renderCard: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  tableClassName?: string;
  cardClassName?: string;
}

export function ResponsiveTableOrCards<T>({
  data,
  columns,
  renderRow,
  renderCard,
  keyExtractor,
  tableClassName,
  cardClassName,
}: ResponsiveTableOrCardsProps<T>) {
  return (
    <>
      {/* Desktop: table */}
      <div className={cn("hidden md:block", tableClassName)}>
        <ResponsiveTable>
          <table className="w-full">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "text-left text-sm font-medium text-muted-foreground px-4 py-3",
                      col.className
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{data.map((item) => renderRow(item))}</tbody>
          </table>
        </ResponsiveTable>
      </div>
      {/* Mobile: stacked cards */}
      <div className={cn("md:hidden space-y-3", cardClassName)}>
        {data.map((item) => (
          <div key={keyExtractor(item)}>{renderCard(item)}</div>
        ))}
      </div>
    </>
  );
}
