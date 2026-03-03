"use client";

import { cn } from "@/lib/utils";
import { DASHBOARD_STATUS_TITLES } from "@/context/dashboard";

/** "Semua" plus dashboard status titles (SIAP, KIRIM, LOKASI, CEK, OK) */
export const PILL_OPTIONS = ["Semua", ...DASHBOARD_STATUS_TITLES] as const;

export type PillValue = (typeof PILL_OPTIONS)[number];

export interface PillGroupProps {
  value?: PillValue;
  onChange?: (value: PillValue) => void;
  className?: string;
}

export function PillGroup({
  value = "Semua",
  onChange,
  className,
}: PillGroupProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 gap-2 overflow-x-auto overflow-y-hidden pb-1 -mx-1 px-1",
        className
      )}
      role="tablist"
      aria-label="Filter status"
    >
      {PILL_OPTIONS.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(option)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-background text-foreground hover:bg-muted/50"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
