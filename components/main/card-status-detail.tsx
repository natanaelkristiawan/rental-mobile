"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { usePicStore } from "@/context/pic";
import { Sign } from "@/components/main/sign";
import { cn } from "@/lib/utils";

const PIC_OTHER_VALUE = "other";

export interface CardStatusDetailProps {
  className?: string;
}

export function CardStatusDetail({ className }: CardStatusDetailProps) {
  const [selectedPicId, setSelectedPicId] = useState("");
  const [picOtherName, setPicOtherName] = useState("");

  const { items: picItems, isLoading: picLoading, error: picError, fetchPics } = usePicStore();

  useEffect(() => {
    fetchPics();
  }, [fetchPics]);

  const isPicOther = selectedPicId === PIC_OTHER_VALUE;

  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <CardHeader className="px-4">
        <h3 className="font-semibold text-foreground">Detail</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="pic-select">Nama PIC</Label>
          <select
            id="pic-select"
            value={selectedPicId}
            onChange={(e) => setSelectedPicId(e.target.value)}
            disabled={picLoading}
            className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
          >
            <option value="">— Pilih PIC —</option>
            {picItems.map((pic) => (
              <option key={pic.id} value={pic.id}>
                {pic.name}
              </option>
            ))}
            <option value={PIC_OTHER_VALUE}>Lainnya</option>
          </select>
          {picError && (
            <p className="text-sm text-destructive" role="alert">
              {picError}
            </p>
          )}
        </div>
        {isPicOther && (
          <div className="space-y-2">
            <Label htmlFor="pic-other-name">Nama PIC (Lainnya)</Label>
            <Input
              id="pic-other-name"
              type="text"
              placeholder="Masukkan nama PIC"
              value={picOtherName}
              onChange={(e) => setPicOtherName(e.target.value)}
            />
          </div>
        )}
        <Sign height={200} className="pt-2" />
      </CardContent>
    </Card>
  );
}
