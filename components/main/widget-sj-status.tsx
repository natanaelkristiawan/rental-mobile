"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Truck,
  MapPin,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type SJStatusProgress = "finished" | "running" | "next";

export interface WidgetSJStatusStep {
  /** Step title (e.g. "Siap di Gudang") */
  title: string;
  /** Optional subtitle (e.g. "PIC Gudang: Gungde") */
  subtitle?: string;
  /** Progress state: finished (green check), running (blue + status pill), next (grey) */
  progress: SJStatusProgress;
  /** Status label when progress is "running" (e.g. "DALAM PERJALANAN") */
  status?: string;
  /** Icon for this step when running or next; finished step always shows check */
  icon?: LucideIcon;
}

const DEFAULT_ICONS: LucideIcon[] = [
  CheckCircle2,
  Truck,
  MapPin,
  RotateCcw,
  ShieldCheck,
];

export interface WidgetSJStatusProps {
  steps: WidgetSJStatusStep[];
  className?: string;
}

export function WidgetSJStatus({ steps, className }: WidgetSJStatusProps) {
  return (
    <div className={cn("flex flex-col", className)} role="list">
      {steps.map((step, index) => {
        const Icon = step.icon ?? DEFAULT_ICONS[index % DEFAULT_ICONS.length];
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="relative flex gap-3">
            {/* Vertical line */}
            {!isLast && (
              <div
                className="absolute left-[11px] top-8 bottom-0 w-px bg-border"
                aria-hidden
              />
            )}

            {/* Icon circle */}
            <div
              className={cn(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                step.progress === "finished" &&
                  "border-emerald-500 bg-emerald-500 text-white",
                step.progress === "running" &&
                  "border-blue-500 bg-blue-500 text-white",
                step.progress === "next" &&
                  "border-muted bg-muted text-muted-foreground"
              )}
            >
              {step.progress === "finished" ? (
                <CheckCircle2 className="size-3.5" aria-hidden />
              ) : (
                <Icon className="size-3.5" aria-hidden />
              )}
            </div>

            {/* Title + subtitle */}
            <div className="min-w-0 flex-1 pb-6 flex flex-col gap-2">
              {step.progress === "running" && step.status && (
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                    {step.status}
                  </span>
              )}
              <div className="d-block">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    step.progress === "next"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {step.title}
                </span>
                {step.subtitle && (
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    step.progress === "next"
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {step.subtitle}
                </p>
              )}
              </div>
             
            
            </div>
          </div>
        );
      })}
    </div>
  );
}
