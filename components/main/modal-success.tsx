"use client";

import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ModalSuccessProps {
  /** When true, the modal is visible */
  open: boolean;
  /** Title shown below the icon (e.g. "Berhasil") */
  title?: string;
  /** Optional detail message */
  message?: string;
  /** Label for the primary button; default "OK" */
  buttonLabel?: string;
  /** Called when the button is clicked or overlay is clicked (close) */
  onClose: () => void;
  /** Optional class for the overlay */
  className?: string;
}

export function ModalSuccess({
  open,
  title = "Berhasil",
  message,
  buttonLabel = "OK",
  onClose,
  className,
}: ModalSuccessProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-success-title"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
        className
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex flex-col items-center gap-4 rounded-2xl bg-card px-8 py-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CircleCheck
          className="size-14 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
        <div className="text-center">
          <h2
            id="modal-success-title"
            className="text-lg font-semibold text-foreground"
          >
            {title}
          </h2>
          {message && (
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          )}
        </div>
        <Button onClick={onClose} className="min-w-24">
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
