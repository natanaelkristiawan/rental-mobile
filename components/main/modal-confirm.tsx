"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ModalConfirmProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

export function ModalConfirm({
  open,
  title = "Konfirmasi Aksi",
  message = "Perubahan ini tidak dapat dibatalkan. Lanjutkan?",
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  className,
}: ModalConfirmProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-confirm-title"
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
        className
      )}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-card px-6 py-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="mt-0.5 size-6 shrink-0 text-amber-500"
            aria-hidden
          />
          <div>
            <h2
              id="modal-confirm-title"
              className="text-base font-semibold text-foreground"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
