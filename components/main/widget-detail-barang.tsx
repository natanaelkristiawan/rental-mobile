"use client";

import { cn } from "@/lib/utils";

export interface WidgetDetailBarangProps {
  /** Item name (e.g. "Kabel LAN 100M") */
  name: string;
  /** Secondary line: category/spec, optional bullet separator (e.g. "Kabel Data • LAN100M") */
  details?: string;
  /** Quantity (e.g. 5 or "5") */
  quantity: number | string;
  /** Unit label (e.g. "UNIT") */
  unit?: string;
  className?: string;
}

export function WidgetDetailBarang({
  name,
  details,
  quantity,
  unit = "UNIT",
  className,
}: WidgetDetailBarangProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-tight text-foreground">
          {name}
        </p>
        {details != null && details !== "" && (
          <p className="mt-1 text-xs text-muted-foreground">{details}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end">
        <p className="text-xl font-bold leading-tight text-blue-600">
          {quantity}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{unit}</p>
      </div>
    </div>
  );
}
