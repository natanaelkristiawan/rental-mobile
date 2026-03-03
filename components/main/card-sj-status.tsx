"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WidgetSJStatus } from "@/components/main/widget-sj-status";
import type { WidgetSJStatusStep } from "@/components/main/widget-sj-status";

export interface CardSJStatusProps {
  /** Status steps for the timeline (same as WidgetSJStatus) */
  steps: WidgetSJStatusStep[];
  /** Card title; default "STATUS PENGIRIMAN" */
  title?: string;
  className?: string;
}

export function CardSJStatus({
  steps,
  title = "STATUS PENGIRIMAN",
  className,
}: CardSJStatusProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <CardHeader className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
          {title}
        </h2>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <WidgetSJStatus steps={steps} />
      </CardContent>
    </Card>
  );
}
