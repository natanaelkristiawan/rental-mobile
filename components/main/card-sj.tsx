"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Package, type LucideIcon } from "lucide-react";
import {
  VARIANT_STYLES,
  type StatCardVariant,
} from "@/components/main/card-status";

export interface CardSJProps {
  /** Status label shown in the badge (e.g. "Siap Gudang") */
  status: string;
  /** Optional icon for the status badge; defaults to Package */
  statusIcon?: LucideIcon;
  /** Reference/tracking ID (e.g. "SJLED-04E56F11") */
  referenceId: string;
  /** Client name (e.g. "PT Maju Jaya") */
  clientName: string;
  /** Location (e.g. "Grand Hyatt Bali") */
  location: string;
  /** Item count label (e.g. "2 Koli") */
  itemCount: string;
  /** Called when the card is clicked (e.g. navigate to detail) */
  onClick?: () => void;
  className?: string;
}

/** Map dashboard status title to card-status variant (same order as stat cards) */
function statusToVariant(status: string): StatCardVariant {
  switch (status) {
    case "SIAP":
      return "purple";
    case "KIRIM":
      return "blue";
    case "LOKASI":
      return "orange";
    case "CEK":
      return "green";
    case "OK":
      return "red";
    default:
      return "purple";
  }
}

export function CardSJ({
  status,
  statusIcon: StatusIcon = Package,
  referenceId,
  clientName,
  location,
  itemCount,
  onClick,
  className,
}: CardSJProps) {
  const badgeStyle = VARIANT_STYLES[statusToVariant(status)].badge;

  return (
    <Card
      className={cn(
        "cursor-pointer rounded-3xl border border-border/60 bg-card/90 py-6 px-4 shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <CardHeader className="flex flex-col gap-1 p-0">
        <div className="flex min-w-0 items-start justify-between gap-12">
          <p className="min-w-0 break-all text-sm font-medium leading-snug tracking-[0.16em] text-muted-foreground/70 uppercase line-clamp-2">
            {referenceId}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wide",
              badgeStyle
            )}
          >
            <StatusIcon className="size-3.5 shrink-0" aria-hidden />
            {status}
          </span>
        </div>

        <h2 className="mt-1 text-lg font-semibold leading-tight text-foreground">
          {clientName}
        </h2>
      </CardHeader>

      <CardContent className="mt-3 flex flex-col gap-3 p-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 col">
            <span className="flex size-7 items-center justify-center rounded-full bg-muted/60">
              <MapPin
                className="size-3.5 text-muted-foreground"
                aria-hidden
              />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Tujuan
              </span>
              <span className="text-sm font-medium text-foreground">
                {location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-muted/60">
              <Package
                className="size-3.5 text-muted-foreground"
                aria-hidden
              />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Muatan
              </span>
              <span className="text-sm font-medium text-foreground">
                {itemCount}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
