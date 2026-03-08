"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NavigationTopBack } from "@/components/main/navigation-top-back";
import { CardStatusCurrent } from "@/components/main/card-status-current";
import { CardStatusAction } from "@/components/main/card-status-action";
import type { CardStatusActionVariant } from "@/components/main/card-status-action";
import { CardStatusDetail } from "@/components/main/card-status-detail";
import {
  Archive,
  Truck,
  MapPin,
  RotateCcw,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalLoading } from "@/components/main/modal-loading";
import { ModalSuccess } from "@/components/main/modal-success";
import { ModalFailed } from "@/components/main/modal-failed";
import { useSuratJalanStore } from "@/context/suratJalan";

/** Convert URL slug to referenceId (SJLED-xxx -> SJLED/xxx) */
function toReferenceId(slug: string): string {
  return slug.replace(/^([A-Za-z0-9]+)-/, "$1/");
}

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
  const router = useRouter();
  const id = params.id as string;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const updateStatus = useSuratJalanStore((s) => s.updateStatus);
  const isUpdating = useSuratJalanStore((s) => s.isUpdating);
  const modalSuccess = useSuratJalanStore((s) => s.modalSuccess);
  const modalFailed = useSuratJalanStore((s) => s.modalFailed);
  const updateError = useSuratJalanStore((s) => s.updateError);
  const closeSuccessModal = useSuratJalanStore((s) => s.closeSuccessModal);
  const closeFailedModal = useSuratJalanStore((s) => s.closeFailedModal);

  const referenceId = toReferenceId(id);

  async function handleSimpan() {
    try {
      await updateStatus(referenceId, {
        picId: "1",
        picName: "Demo PIC",
        statusId: selectedIndex ?? 0,
        signImage: null,
      });
    } catch {
      // Error and modal handled in store
    }
  }

  function handleCloseSuccess() {
    closeSuccessModal();
    router.push(`/surat-jalan/${id}`);
  }

  return (
    <main className="min-h-screen p-8 pb-32">
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

      <CardStatusDetail className="mt-8" />

      <Button
        type="button"
        onClick={handleSimpan}
        disabled={isUpdating}
        className="mt-8 w-full rounded-full bg-blue-600 py-3 text-white shadow-md hover:bg-blue-700"
        size="lg"
      >
        {isUpdating ? "Memproses..." : "Simpan"}
      </Button>

      <ModalLoading open={isUpdating} message="Memproses..." />
      <ModalSuccess
        open={modalSuccess}
        title="Berhasil"
        message="Status surat jalan telah diperbarui."
        onClose={handleCloseSuccess}
      />
      <ModalFailed
        open={modalFailed}
        title="Gagal"
        message={updateError ?? undefined}
        onClose={closeFailedModal}
      />
    </main>
  );
}
