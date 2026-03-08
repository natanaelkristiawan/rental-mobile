"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PenLine, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SignProps {
  /** Optional callback with canvas data URL (e.g. image/png) when signature changes */
  onChange?: (dataUrl: string | null) => void;
  /** Optional class for the root container */
  className?: string;
  /** Height of the signature canvas in pixels */
  height?: number;
}

export function Sign({
  onChange,
  className,
  height = 200,
}: SignProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const hasDrawnRef = useRef(false);

  const getCanvasPoint = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    []
  );

  const notifyChange = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onChange) return;
    onChange(hasDrawnRef.current ? canvas.toDataURL("image/png") : null);
  }, [onChange]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    notifyChange();
  }, [notifyChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    canvas.width = w;
    canvas.height = h;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [height]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const point = getCanvasPoint(e);
      if (!canvas || !ctx || !point) return;
      setIsDrawing(true);
      hasDrawnRef.current = true;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    },
    [getCanvasPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const ctx = canvasRef.current?.getContext("2d");
      const point = getCanvasPoint(e);
      if (!ctx || !point) return;
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [isDrawing, getCanvasPoint]
  );

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
    notifyChange();
  }, [notifyChange]);

  const handlePointerLeave = useCallback(() => {
    setIsDrawing(false);
  }, []);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenLine className="size-5 text-blue-600 dark:text-blue-400" aria-hidden />
          <h3 className="font-semibold text-foreground">
            TANDA TANGAN DIGITAL
          </h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        >
          <Trash2 className="size-4" aria-hidden />
          Hapus
        </Button>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-white dark:bg-card"
        style={{
          backgroundImage: `radial-gradient(circle, rgb(0 0 0 / 0.08) 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
        }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Area tanda tangan"
          className="block h-full w-full touch-none rounded-2xl"
          style={{ height: `${height}px` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onPointerCancel={handlePointerUp}
        />
      </div>

      <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Pencil className="size-4 shrink-0" aria-hidden />
        TANDA TANGAN DI AREA ATAS
      </p>
    </div>
  );
}
