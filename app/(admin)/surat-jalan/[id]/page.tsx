"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { NavigationTopBack } from "@/components/main/navigation-top-back";
import { CardHeading } from "@/components/main/card-heading";
import { useSuratJalanStore } from "@/context/suratJalan";
import { useSuratJalanDetailStore } from "@/context/suratJalanDetail";
import { CardSJStatus } from "@/components/main/card-sj-status";
import { CardSJEvent } from "@/components/main/card-sj-event";
import { WidgetDetailBarang } from "@/components/main/widget-detail-barang";
import { useSuratJalanBarangStore } from "@/context/suratJalanBarang";
import { Button } from "@/components/ui/button";

/** Convert URL slug back to referenceId (SJLED-xxx -> SJLED/xxx) */
function fromSlug(slug: string): string {
  return slug.replace(/^([A-Za-z0-9]+)-/, "$1/");
}

export default function SuratJalanDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { items } = useSuratJalanStore();

  const referenceId = fromSlug(id);
  const item = items.find(
    (i) => i.referenceId === referenceId || i.referenceId.replace(/\//g, "-") === id
  );
  const suratJalanNumber = item?.referenceId ?? referenceId;

  

  const getSteps = useSuratJalanDetailStore((s) => s.getSteps);
  const steps = getSteps(referenceId);

  const getBarang = useSuratJalanBarangStore((s) => s.getBarang);
  const barangList = getBarang(referenceId);

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
        size="3×4=12m2"
        lokasi={item?.location ?? "—"}
        keterangan="Riser tinggi 50cm Genset 45kva"
        tanggalEvent="2026-02-13 09:00 - 2026-02-14 18:00"
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
 