"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sign } from "@/components/main/sign";
import { cn } from "@/lib/utils";

export interface CardStatusDetailProps {
  className?: string;
  title?: string;
  inputId?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  picName?: string;
  /** Called whenever the signature changes (base64 data URL or null when cleared) */
  onSignChange?: (dataUrl: string | null) => void;
  /** Called whenever PIC text changes */
  onPicNameChange?: (picName: string) => void;
}

export function CardStatusDetail({
  className,
  title = "Detail",
  inputId = "pic-name",
  nameLabel = "Nama PIC",
  namePlaceholder = "Masukkan nama PIC",
  picName = "",
  onSignChange,
  onPicNameChange,
}: CardStatusDetailProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-sm",
        className
      )}
    >
      <CardHeader className="px-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="space-y-2">
          <Label htmlFor={inputId}>{nameLabel}</Label>
          <Input
            id={inputId}
            type="text"
            placeholder={namePlaceholder}
            value={picName}
            onChange={(e) => onPicNameChange?.(e.target.value)}
          />
        </div>
        <Sign height={200} className="pt-2" onChange={onSignChange} />
      </CardContent>
    </Card>
  );
}
