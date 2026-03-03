import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const VARIANT_STYLES = {
  purple: {
    icon: "text-violet-600",
    badge: "bg-violet-100 border-white text-violet-600 dark:bg-violet-500/30 dark:border-background dark:text-violet-200",
  },
  blue: {
    icon: "text-blue-600",
    badge: "bg-blue-100 border-white text-blue-600 dark:bg-blue-500/30 dark:border-background dark:text-blue-200",
  },
  orange: {
    icon: "text-orange-600",
    badge: "bg-orange-100 border-white text-orange-600 dark:bg-orange-500/30 dark:border-background dark:text-orange-200",
  },
  green: {
    icon: "text-emerald-600",
    badge: "bg-emerald-100 border-white text-emerald-600 dark:bg-emerald-500/30 dark:border-background dark:text-emerald-200",
  },
  red: {
    icon: "text-red-600",
    badge: "bg-red-100 border-white text-red-600 dark:bg-red-500/30 dark:border-background dark:text-red-200",
  },
} as const;

export type StatCardVariant = keyof typeof VARIANT_STYLES;

export interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: StatCardVariant;
  className?: string;
}

const VARIANTS: StatCardVariant[] = ["purple", "blue", "orange", "green", "red"];

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "purple",
  className,
}: StatCardProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className={cn("flex flex-1 min-w-0 flex-col items-center gap-1 p-4", className)}>
      <div className="relative inline-flex shrink-0">
        <Icon
          className={cn("size-6", styles.icon)}
          strokeWidth={2}
          aria-hidden
        />
        <span
          className={cn(
            "absolute right-0 top-0 flex size-4 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white text-[10px] font-semibold leading-none dark:border-background",
            styles.badge
          )}
        >
          {value}
        </span>
      </div>
      <span className="text-center text-[10px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
        {title}
      </span>
    </div>
  );
}

/** Wrapper to render a horizontal row of stat cards with dividers between them */
export function StatCardRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-1 overflow-x-auto pb-1",
        className
      )}
      role="list"
    >
      {children}
    </div>
  );
}

/** Get variant by index for consistent coloring across a list */
export function getStatCardVariant(index: number): StatCardVariant {
  return VARIANTS[index % VARIANTS.length];
}
