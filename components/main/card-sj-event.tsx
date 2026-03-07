"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Calendar } from "lucide-react";

const LABEL_CLASS =
  "text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground";

export interface CardSJEventProps {
  /** PIC Client name (e.g. "Budi Santoso") */
  picClient: string;
  /** Size value (e.g. "3×4=12m2") */
  size: string;
  /** Location name (e.g. "Sofitel Nusa Dua") */
  lokasi: string;
  /** Notes/description (e.g. "Riser tinggi 50cm Genset 45kva") */
  keterangan: string;
  /** Event date range (e.g. "2026-02-13 09:00 - 2026-02-14 18:00") */
  tanggalEvent: string;
  className?: string;
}

export function CardSJEvent({
  picClient,
  size,
  lokasi,
  keterangan,
  tanggalEvent,
  className,
}: CardSJEventProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Top row: PIC CLIENT | SIZE */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <p className={LABEL_CLASS}>PIC CLIENT</p>
            <p className="text-sm font-semibold text-foreground">{picClient}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className={LABEL_CLASS}>SIZE</p>
            <p className="text-sm font-semibold text-foreground">{size}</p>
          </div>
        </div>

        {/* LOKASI */}
        <div className="flex flex-col gap-1">
          <p className={LABEL_CLASS}>LOKASI</p>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-blue-500" aria-hidden />
            <p className="text-sm font-semibold text-foreground">{lokasi}</p>
          </div>
        </div>

        {/* KETERANGAN */}
        <div className="flex flex-col gap-1">
          <p className={LABEL_CLASS}>KETERANGAN</p>
          <p className="text-sm text-foreground">{keterangan}</p>
        </div>

        {/* TANGGAL EVENT */}
        <div className="flex flex-col gap-1">
          <p className={LABEL_CLASS}>TANGGAL EVENT</p>
          <div className="flex items-center gap-2">
            <Calendar className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <p className="text-sm text-foreground">{tanggalEvent}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
