"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalLoadingProps {
  /** When true, the modal is visible */
  open: boolean;
  /** Optional message below the spinner */
  message?: string;
  /** Optional class for the overlay */
  className?: string;
}

export function ModalLoading({
  open,
  message,
  className,
}: ModalLoadingProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-label={message ?? "Memuat"}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-card px-8 py-6 shadow-lg">
        <Loader2
          className="size-10 animate-spin text-primary"
          aria-hidden
        />
        {message && (
          <p className="text-center text-sm font-medium text-foreground">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
