import {
  Card as UICard,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, className }: StatCardProps) {
  return (
    <UICard className={cn(className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight ">{value}</p>
      </CardContent>
    </UICard>
  );
}
