"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SuratJalanItem } from "@/context/suratJalan";

export interface SearchSuratJalanProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

export function SearchSuratJalan({
  value,
  onChange,
  placeholder = "Cari Surat Jalan...",
  className,
  "aria-label": ariaLabel = "Cari Surat Jalan",
}: SearchSuratJalanProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={ariaLabel}
      />
    </div>
  );
}

/** Searchable fields on a Surat Jalan item */
const SEARCH_FIELDS: (keyof SuratJalanItem)[] = [
  "referenceId",
  "clientName",
  "location",
  "itemCount",
  "status",
];

/**
 * Filters Surat Jalan items by query (case-insensitive).
 * Matches against referenceId, clientName, location, itemCount, and status.
 */
export function filterSuratJalanByQuery(
  items: SuratJalanItem[],
  query: string
): SuratJalanItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) =>
    SEARCH_FIELDS.some((field) => {
      const val = item[field];
      return typeof val === "string" && val.toLowerCase().includes(q);
    })
  );
}
