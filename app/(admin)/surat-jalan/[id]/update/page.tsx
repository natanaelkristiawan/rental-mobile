"use client";

import { useState, useEffect, useMemo } from "react";
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
import { ModalConfirm } from "@/components/main/modal-confirm";
import { useSuratJalanStore } from "@/context/suratJalan";
import { useSuratJalanDetailStore } from "@/context/suratJalanDetail";
import type { DashboardStatusTitle } from "@/context/dashboard";
import type { SuratJalanDetailStep } from "@/context/suratJalanDetail";

/** Map API status code to label shown in "status saat ini" */
const STATUS_CODE_LABELS: Record<DashboardStatusTitle, string> = {
  SIAP: "Siap di Gudang",
  KIRIM: "Barang Dikirim",
  LOKASI: "Diterima Di Lokasi",
  CEK: "Kembali ke Gudang",
  OK: "Verifikasi & Update Stok",
};

function getCurrentStatusLabel(
  steps: SuratJalanDetailStep[],
  apiStatus: DashboardStatusTitle | undefined
): string {
  const running = steps.find((s) => s.progress === "running");
  if (running) {
    return running.status?.trim() || running.title;
  }
  if (apiStatus && apiStatus in STATUS_CODE_LABELS) {
    return STATUS_CODE_LABELS[apiStatus];
  }
  return "—";
}

/** Convert URL slug to referenceId (SJLED-xxx -> SJLED/xxx) */
function toReferenceId(slug: string): string {
  return slug.replace(/^([A-Za-z0-9]+)-/, "$1/");
}

const STATUS_ACTIONS: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
  variant: CardStatusActionVariant;
  action: string;
}> = [
  {
    title: "Konfirmasi Pengiriman",
    description: "Barang telah dikirim dari gudang",
    icon: Truck,
    variant: "blue",
    action: "kirim",
  },
  {
    title: "Terima di Lokasi",
    description: "Barang telah sampai di lokasi event",
    icon: MapPin,
    variant: "orange",
    action: "lokasi",
  },
  {
    title: "Konfirmasi Barang Kembali",
    description: "Barang telah kembali ke gudang",
    icon: RotateCcw,
    variant: "orange",
    action: "cek",
  },
  {
    title: "Verifikasi & Update Stok",
    description: "Barang telah dicek, update stok gudang",
    icon: CircleCheck,
    variant: "green",
    action: "ok",
  },
];

const ACTION_STEP_TITLE_MAP: Record<string, string> = {
  kirim: "Barang Dikirim",
  lokasi: "Diterima Di Lokasi",
  cek: "Kembali ke Gudang",
  ok: "Verifikasi & Update Stok",
};

export default function SuratJalanUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signImage, setSignImage] = useState<string | null>(null);
  const [picId, setPicId] = useState("");
  const [picName, setPicName] = useState("");

  const { item, loading, error, fetch, steps } = useSuratJalanDetailStore();

  useEffect(() => {
    if (id) {
      void fetch(id);
    }
  }, [id]);

  const currentStatusLabel = useMemo(
    () => getCurrentStatusLabel(steps, item?.status),
    [steps, item?.status]
  );
  const enabledActionKeys = useMemo(() => {
    const firstNextStep = steps.find((step) => step.progress === "next");
    if (!firstNextStep) return new Set<string>();

    const enabledAction = STATUS_ACTIONS.find(
      (action) => ACTION_STEP_TITLE_MAP[action.action] === firstNextStep.title
    );
    return new Set(enabledAction ? [enabledAction.action] : []);
  }, [steps]);

  const updateStatus = useSuratJalanStore((s) => s.updateStatus);
  const isUpdating = useSuratJalanStore((s) => s.isUpdating);
  const modalSuccess = useSuratJalanStore((s) => s.modalSuccess);
  const modalFailed = useSuratJalanStore((s) => s.modalFailed);
  const updateError = useSuratJalanStore((s) => s.updateError);
  const closeSuccessModal = useSuratJalanStore((s) => s.closeSuccessModal);
  const closeFailedModal = useSuratJalanStore((s) => s.closeFailedModal);

  const referenceId = toReferenceId(id);

  useEffect(() => {
    if (selectedIndex === null) return;
    const selectedAction = STATUS_ACTIONS[selectedIndex];
    if (!selectedAction || !enabledActionKeys.has(selectedAction.action)) {
      setSelectedIndex(null);
    }
  }, [selectedIndex, enabledActionKeys]);

  async function handleSimpan() {
    try {
      const selectedAction = selectedIndex !== null ? STATUS_ACTIONS[selectedIndex] : null;
      await updateStatus(referenceId, {
        picId,
        picName,
        statusId: selectedIndex ?? 0,
        action: selectedAction?.action ?? "",
        signImage,
      });
    } catch {
      // Error and modal handled in store
    }
  }

  function handleOpenConfirm() {
    if (
      isUpdating ||
      selectedIndex === null ||
      !enabledActionKeys.has(STATUS_ACTIONS[selectedIndex]?.action ?? "")
    ) {
      return;
    }
    setConfirmOpen(true);
  }

  async function handleConfirmSimpan() {
    setConfirmOpen(false);
    await handleSimpan();
  }

  function handleCloseSuccess() {
    closeSuccessModal();
    router.push(`/surat-jalan/${id}`);
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8 pb-32">
        <NavigationTopBack
          title="Update Surat Jalan"
          backHref={`/surat-jalan/${id}`}
        />
        <p className="mt-4 text-muted-foreground">Memuat...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-8 pb-32">
        <NavigationTopBack
          title="Update Surat Jalan"
          backHref={`/surat-jalan/${id}`}
        />
        <p className="mt-4 text-destructive">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 pb-32">
      <NavigationTopBack
        title="Update Surat Jalan"
        backHref={`/surat-jalan/${id}`}
      />

      <CardStatusCurrent
        status={currentStatusLabel}
        suratJalanId={id}
        className="mt-6 p-0"
      />
      <h3 className="mt-6 font-semibold text-foreground">Pilih Aksi</h3>

      <div className="mt-3 flex flex-col gap-3">
        {STATUS_ACTIONS.map((action, index) => {
          const isEnabled = enabledActionKeys.has(action.action);
          return (
            <CardStatusAction
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              variant={action.variant}
              selected={isEnabled && selectedIndex === index}
              onClick={isEnabled ? () => setSelectedIndex(index) : undefined}
              className={isEnabled ? "p-0" : "p-0 opacity-50"}
            />
          );
        })}
      </div>

      <CardStatusDetail
        className="mt-8"
        onSignChange={setSignImage}
        onPicChange={(id, name) => {
          setPicId(id);
          setPicName(name);
        }}
      />

      <Button
        type="button"
        onClick={handleOpenConfirm}
        disabled={
          isUpdating ||
          selectedIndex === null ||
          !enabledActionKeys.has(STATUS_ACTIONS[selectedIndex]?.action ?? "")
        }
        className="mt-8 w-full rounded-full bg-blue-600 py-3 text-white shadow-md hover:bg-blue-700"
        size="lg"
      >
        {isUpdating ? "Memproses..." : "Simpan"}
      </Button>

      <ModalLoading open={isUpdating} message="Memproses..." />
      <ModalConfirm
        open={confirmOpen}
        title="Yakin ingin menyimpan aksi ini?"
        message="Aksi yang dipilih tidak dapat diurungkan. Pastikan data sudah benar sebelum melanjutkan."
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
        onConfirm={() => {
          void handleConfirmSimpan();
        }}
        onCancel={() => setConfirmOpen(false)}
      />
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
