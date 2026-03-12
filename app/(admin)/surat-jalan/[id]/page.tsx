"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NavigationTopBack } from "@/components/main/navigation-top-back";
import { CardHeading } from "@/components/main/card-heading";
import { useSuratJalanDetailStore } from "@/context/suratJalanDetail";
import { CardSJStatus } from "@/components/main/card-sj-status";
import { CardSJEvent } from "@/components/main/card-sj-event";
import { WidgetDetailBarang } from "@/components/main/widget-detail-barang";
import { useSuratJalanBarangStore } from "@/context/suratJalanBarang";
import { Button } from "@/components/ui/button";

export default function SuratJalanDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { item, loading, error, fetch } = useSuratJalanDetailStore();

  useEffect(() => {
    if (id) fetch(id);
  }, [id, fetch]);

  const suratJalanNumber = item?.referenceId ?? id;

  const getSteps = useSuratJalanDetailStore((s) => s.getSteps);
  const effectiveReferenceId = item?.referenceId ?? "";
  const steps = getSteps(effectiveReferenceId);

  const getBarang = useSuratJalanBarangStore((s) => s.getBarang);
  const barangList = getBarang(effectiveReferenceId);

  const tanggalEvent =
    item?.event_start_date && item?.event_end_date
      ? `${item.event_start_date} - ${item.event_end_date}`
      : "—";

  if (loading) {
    return (
      <main className="min-h-screen p-8 pb-24">
        <NavigationTopBack title="Detail Surat Jalan" backHref="/" />
        <p className="mt-4 text-muted-foreground">Memuat...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 pb-24">
        <NavigationTopBack title="Detail Surat Jalan" backHref="/" />
        <p className="mt-4 text-destructive">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <NavigationTopBack title="Detail Surat Jalan" backHref="/" />
      
      <CardHeading
        label="NO. SURAT JALAN"
        value={suratJalanNumber}
        className="mt-4"
      />
      <Button
        asChild
        className="mt-6 w-full rounded-full bg-blue-600 py-3 text-white shadow-md hover:bg-blue-700"
        size="lg"
      >
        <Link href={`/surat-jalan/${id}/update`}>Update Status</Link>
      </Button>
      
      <CardSJStatus steps={steps} className="mt-6" />
      
      <CardSJEvent
        picClient={item?.clientName ?? "—"}
        size={item?.size ?? "—"}
        lokasi={item?.location ?? "—"}
        keterangan={item?.keterangan ?? "—"}
        tanggalEvent={tanggalEvent}
        className="mt-6"
      />
      <h3 className="mt-6 text-lg font-semibold text-foreground">
        Detail Barang
      </h3>
      <div className="mt-3 flex flex-col gap-4">
        {barangList.map((barang, index) => (
          <WidgetDetailBarang
            key={`${barang.name}-${index}`}
            name={barang.name}
            details={barang.details}
            quantity={barang.quantity}
            unit={barang.unit}
          />
        ))}
        {barangList.length === 0 && (
          <p className="text-sm text-muted-foreground">Tidak ada detail barang.</p>
        )}
      </div>


    </main>
  );
}
 