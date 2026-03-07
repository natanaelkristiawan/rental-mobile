"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Archive, ChevronRight, type LucideIcon } from "lucide-react";

const ICON_VARIANTS = {
  blue: {
    bg: "bg-sky-100 dark:bg-sky-500/20",
    icon: "text-sky-600 dark:text-sky-400",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-500/20",
    icon: "text-orange-600 dark:text-orange-400",
  },
  green: {
    bg: "bg-emerald-100 dark:bg-emerald-500/20",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
} as const;

export type CardStatusActionVariant = keyof typeof ICON_VARIANTS;

export interface CardStatusActionProps {
  /** Title (e.g. "Konfirmasi Barang Siap") */
  title: string;
  /** Subtitle / description (e.g. "Barang sudah disiapkan di gudang") */
  description?: string;
  /** Left icon; defaults to Archive (box/drawer style) */
  icon?: LucideIcon;
  /** Icon circle color variant */
  variant?: CardStatusActionVariant;
  /** When true, card shows a green selected background */
  selected?: boolean;
  /** Called when the card is clicked */
  onClick?: () => void;
  /** Optional href for link behavior (use with asChild + Link if needed) */
  className?: string;
}

export function CardStatusAction({
  title,
  description,
  icon: Icon = Archive,
  variant = "blue",
  selected = false,
  onClick,
  className,
}: CardStatusActionProps) {
  const isInteractive = Boolean(onClick);
  const styles = ICON_VARIANTS[variant];

  return (
    <Card
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        "rounded-2xl border shadow-sm transition-colors",
        selected
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-500/10 hover:bg-emerald-100 active:bg-emerald-200 dark:hover:bg-emerald-500/20 dark:active:bg-emerald-500/30"
          : "border-border/60 bg-card",
        isInteractive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isInteractive &&
          !selected &&
          "hover:bg-muted/50 active:bg-muted",
        className
      )}
    >
      <CardContent className="flex items-center gap-4 px-4 py-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full",
            styles.bg
          )}
          aria-hidden
        >
          <Icon className={cn("size-5", styles.icon)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{title}</p>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <ChevronRight
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </CardContent>
    </Card>
  );
}
