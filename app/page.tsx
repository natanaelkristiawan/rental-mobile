"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Package, Truck, MapPin, Warehouse } from "lucide-react";
import { StatCard } from "@/components/main/card-status";
import { PillGroup, type PillValue } from "@/components/main/pill-group";
import {
  getDashboardCards,
  type DashboardStatCard,
} from "@/context/dashboard";

const ICON_MAP: Record<DashboardStatCard["icon"], LucideIcon> = {
  package: Package,
  truck: Truck,
  "map-pin": MapPin,
  warehouse: Warehouse,
};

export default function Home() {
  const [cards, setCards] = useState<DashboardStatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pillValue, setPillValue] = useState<PillValue>("Semua");

  useEffect(() => {
    getDashboardCards()
      .then((res) => {
        if (res.statusCode >= 400) {
          setError(res.message ?? "Failed to load");
          return;
        }
        setCards(res.data);
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen p-8 pb-24">
      <h1 className="text-2xl font-semibold text-foreground">Beranda</h1>
      {loading && (
        <p className="mt-6 text-sm text-muted-foreground">Loading...</p>
      )}
      {error && (
        <p className="mt-6 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    

      {!loading && !error && (
        <div className="mt-4 grid gap-4 grid-cols-2">
          {cards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={ICON_MAP[card.icon]}
            />
          ))}
        </div>
      )}

        {/* filter status */}
        <PillGroup
        value={pillValue}
        onChange={setPillValue}
        className="mt-6"
      />
    </main>
  );
}
