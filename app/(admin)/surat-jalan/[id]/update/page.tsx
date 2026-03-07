"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { NavigationTopBack } from "@/components/main/navigation-top-back";
import { CardStatusCurrent } from "@/components/main/card-status-current";
import { CardStatusAction } from "@/components/main/card-status-action";
import type { CardStatusActionVariant } from "@/components/main/card-status-action";
import {
  Archive,
  Truck,
  MapPin,
  RotateCcw,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";

const STATUS_ACTIONS: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  variant: CardStatusActionVariant;
}> = [
  {
    title: "Konfirmasi Barang Siap",
    description: "Barang sudah disiapkan di gudang",
    icon: Archive,
    variant: "blue",
  },
  {
    title: "Konfirmasi Pengiriman",
    description: "Barang telah dikirim dari gudang",
    icon: Truck,
    variant: "blue",
  },
  {
    title: "Terima di Lokasi",
    description: "Barang telah sampai di lokasi event",
    icon: MapPin,
    variant: "orange",
  },
  {
    title: "Konfirmasi Barang Kembali",
    description: "Barang telah kembali ke gudang",
    icon: RotateCcw,
    variant: "orange",
  },
  {
    title: "Verifikasi & Update Stok",
    description: "Barang telah dicek, update stok gudang",
    icon: CircleCheck,
    variant: "green",
  },
];

export default function SuratJalanUpdatePage() {
  const params = useParams();
  const id = params.id as string;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen p-8 pb-24">
      <NavigationTopBack
        title="Update Surat Jalan"
        backHref={`/surat-jalan/${id}`}
      />

      <CardStatusCurrent
        status="Barang Dikirim"
        suratJalanId={id}
        className="mt-6 p-0"
      />
      <h3 className="mt-6 font-semibold text-foreground">Pilih Aksi</h3>

      <div className="mt-3 flex flex-col gap-3">
        {STATUS_ACTIONS.map((action, index) => (
          <CardStatusAction
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
            variant={action.variant}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
            className="p-0"
          />
        ))}
      </div>
    </main>
  );
}
