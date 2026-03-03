"use client";

import { cn } from "@/lib/utils";

export interface CardHeadingProps {
  /** Label above the value (e.g. "NO. SURAT JALAN") */
  label: string;
  /** Main value/identifier (e.g. reference ID) */
  value: string;
  className?: string;
}

export function CardHeading({ label, value, className }: CardHeadingProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm",
        className
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1.5 min-w-0 break-all text-sm font-semibold leading-snug text-foreground">
        {value}
      </p>
    </div>
  );
}
