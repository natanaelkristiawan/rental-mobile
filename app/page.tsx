"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Package, Truck, MapPin, Warehouse, CircleCheck } from "lucide-react";
import {
  StatCard,
  StatCardRow,
  getStatCardVariant,
} from "@/components/main/card-status";
import { CardSJ } from "@/components/main/card-sj";
import { PillGroup, type PillValue } from "@/components/main/pill-group";
import {
  SearchSuratJalan,
  filterSuratJalanByQuery,
} from "@/components/main/search";
import {
  useDashboardStore,
  type DashboardStatCard,
} from "@/context/dashboard";
import {
  useSuratJalanStore,
  getSuratJalanDetailPath,
  type SuratJalanItem,
} from "@/context/suratJalan";

const ICON_MAP: Record<DashboardStatCard["icon"], LucideIcon> = {
  package: Package,
  truck: Truck,
  "map-pin": MapPin,
  warehouse: Warehouse,
  "circle-check": CircleCheck,
};

const SJ_ICON_MAP: Record<
  NonNullable<SuratJalanItem["statusIcon"]>,
  LucideIcon
> = {
  package: Package,
  truck: Truck,
  "map-pin": MapPin,
  warehouse: Warehouse,
  "circle-check": CircleCheck,
};

function HomeContent() {
  const router = useRouter();
  const [pillValue, setPillValue] = useState<PillValue>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    cards,
    loading: dashboardLoading,
    error: dashboardError,
    fetch: fetchDashboard,
  } = useDashboardStore();

  const {
    items: sjItems,
    loading: sjLoading,
    error: sjError,
    fetch: fetchSj,
  } = useSuratJalanStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchSj();
  }, [fetchSj]);

  const loading = dashboardLoading;
  const error = dashboardError ?? sjError;

  const filteredByPill =
    pillValue === "Semua"
      ? sjItems
      : sjItems.filter((item) => item.status === pillValue);
  const filteredSjItems = filterSuratJalanByQuery(filteredByPill, searchQuery);

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

      {!loading && !dashboardError && (
        <StatCardRow className="mt-4">
          {cards.map((card, index) => (
            <Fragment key={card.title}>
              {index > 0 && (
                <div
                  className="h-7 w-px shrink-0 bg-border"
                  aria-hidden
                />
              )}
              <StatCard
                title={card.title}
                value={card.value}
                icon={ICON_MAP[card.icon]}
                variant={getStatCardVariant(index)}
              />
            </Fragment>
          ))}
        </StatCardRow>
      )}

      <PillGroup
        value={pillValue}
        onChange={setPillValue}
        className="mt-6"
      />

      <SearchSuratJalan
        value={searchQuery}
        onChange={setSearchQuery}
        className="my-4"
      />

      <h3 className="text-xl font-semibold text-foreground">Daftar Pengiriman</h3>

      {sjLoading && (
        <p className="mt-4 text-sm text-muted-foreground">
          Memuat Surat Jalan...
        </p>
      )}
      {!sjLoading && !sjError && (
        <div className="mt-4 flex flex-col gap-4">
          {filteredSjItems.map((item) => (
            <CardSJ
              key={item.id}
              status={item.status}
              statusIcon={
                item.statusIcon ? SJ_ICON_MAP[item.statusIcon] : Package
              }
              referenceId={item.referenceId}
              clientName={item.clientName}
              location={item.location}
              itemCount={item.itemCount}
              createdAt={item.createdAt ?? undefined}
              onClick={() => router.push(getSuratJalanDetailPath(item.id))}
            />
          ))}
          {filteredSjItems.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {searchQuery.trim()
                ? "Tidak ada Surat Jalan yang cocok dengan pencarian."
                : "Tidak ada Surat Jalan untuk filter ini."}
            </p>
          )}
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return <HomeContent />;
}
