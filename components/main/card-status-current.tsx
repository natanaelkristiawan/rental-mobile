"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";

export interface CardStatusCurrentProps {
  /** Label above the status pill; default "STATUS SAAT INI:" */
  label?: string;
  /** Status text shown in the pill (e.g. "Barang Dikirim") */
  status: string;
  /** Optional Surat Jalan / Surat Barang ID shown in the card */
  suratJalanId?: string;
  className?: string;
}

export function CardStatusCurrent({
  label = "STATUS SAAT INI:",
  status,
  className,
}: CardStatusCurrentProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <CardContent className="p-4">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-200 mb-3">
          <Truck className="size-4 shrink-0" aria-hidden />
          <span>{status}</span>
        </div>
      </CardContent>
    </Card>
  );
}
