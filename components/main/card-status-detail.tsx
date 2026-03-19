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
  /** Called whenever the signature changes (base64 data URL or null when cleared) */
  onSignChange?: (dataUrl: string | null) => void;
  /** Called whenever the PIC selection changes, with resolved id and display name */
  onPicChange?: (picId: string, picName: string) => void;
}

export function CardStatusDetail({ className, onSignChange, onPicChange }: CardStatusDetailProps) {
  const [selectedPicId, setSelectedPicId] = useState("");
  const [picOtherName, setPicOtherName] = useState("");

  const {
    items: picItems,
    defaultSelectedId,
    isLoading: picLoading,
    error: picError,
    fetchPics,
  } = usePicStore();

  useEffect(() => {
    fetchPics();
  }, [fetchPics]);

  useEffect(() => {
    if (!selectedPicId && defaultSelectedId) {
      setSelectedPicId(defaultSelectedId);
      const matched = picItems.find((p) => p.id === defaultSelectedId);
      if (matched) {
        onPicChange?.(matched.id, matched.name);
      }
    }
  }, [selectedPicId, defaultSelectedId, picItems, onPicChange]);

  function handlePicChange(value: string) {
    setSelectedPicId(value);
    if (value === PIC_OTHER_VALUE) {
      onPicChange?.(PIC_OTHER_VALUE, picOtherName);
    } else {
      const matched = picItems.find((p) => p.id === value);
      onPicChange?.(value, matched?.name ?? "");
    }
  }

  function handleOtherNameChange(value: string) {
    setPicOtherName(value);
    if (selectedPicId === PIC_OTHER_VALUE) {
      onPicChange?.(PIC_OTHER_VALUE, value);
    }
  }

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
            onChange={(e) => handlePicChange(e.target.value)}
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
              onChange={(e) => handleOtherNameChange(e.target.value)}
            />
          </div>
        )}
        <Sign height={200} className="pt-2" onChange={onSignChange} />
      </CardContent>
    </Card>
  );
}
