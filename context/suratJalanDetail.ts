import { create } from "zustand";
import type { SJStatusProgress } from "@/components/main/widget-sj-status";

/** Step data for widget-sj-status (no icon; widget uses default by index) */
export interface SuratJalanDetailStep {
  title: string;
  subtitle?: string;
  progress: SJStatusProgress;
  status?: string;
}

/** Default steps when no data for a given ID */
const DEFAULT_STEPS: SuratJalanDetailStep[] = [
  { title: "Siap di Gudang", subtitle: "PIC Gudang: -", progress: "finished" },
  { title: "Barang Dikirim", subtitle: "PIC Gudang: -", progress: "next" },
  { title: "Diterima Di Lokasi", subtitle: "PIC Lapangan: -", progress: "next" },
  { title: "Kembali ke Gudang", subtitle: "PIC Lapangan: -", progress: "next" },
  {
    title: "Verifikasi & Update Stok",
    subtitle: "PIC Gudang: -",
    progress: "next",
  },
];

/** Sample status steps by Surat Jalan referenceId (ID from list/detail) */
const SAMPLE_STEPS_BY_REFERENCE_ID: Record<string, SuratJalanDetailStep[]> = {
  "SJLED/d4e56f11-xyz4-7zzk-a1b2-1234567890ab": [
    {
      title: "Siap di Gudang",
      subtitle: "PIC Gudang: Gungde",
      progress: "finished",
    },
    {
      title: "Barang Dikirim",
      subtitle: "PIC Gudang: Gungde",
      progress: "running",
      status: "DALAM PERJALANAN",
    },
    {
      title: "Diterima Di Lokasi",
      subtitle: "PIC Lapangan: Wayan",
      progress: "next",
    },
    {
      title: "Kembali ke Gudang",
      subtitle: "PIC Lapangan: Wayan",
      progress: "next",
    },
    {
      title: "Verifikasi & Update Stok",
      subtitle: "PIC Gudang: Gungde",
      progress: "next",
    },
  ],
  "SJLED/e5f67g22-yza5-8aal-b2c3-2345678901bc": [
    { title: "Siap di Gudang", subtitle: "PIC Gudang: Gungde", progress: "finished" },
    { title: "Barang Dikirim", subtitle: "PIC Gudang: Gungde", progress: "finished" },
    {
      title: "Diterima Di Lokasi",
      subtitle: "PIC Lapangan: Wayan",
      progress: "running",
      status: "MENUNGGU KONFIRMASI",
    },
    { title: "Kembali ke Gudang", subtitle: "PIC Lapangan: Wayan", progress: "next" },
    {
      title: "Verifikasi & Update Stok",
      subtitle: "PIC Gudang: Gungde",
      progress: "next",
    },
  ],
  "SJLED/f6g78h33-azb6-9bbm-c3d4-3456789012cd": [
    { title: "Siap di Gudang", subtitle: "PIC Gudang: Gungde", progress: "finished" },
    { title: "Barang Dikirim", subtitle: "PIC Gudang: Gungde", progress: "finished" },
    { title: "Diterima Di Lokasi", subtitle: "PIC Lapangan: Wayan", progress: "finished" },
    { title: "Kembali ke Gudang", subtitle: "PIC Lapangan: Wayan", progress: "finished" },
    {
      title: "Verifikasi & Update Stok",
      subtitle: "PIC Gudang: Gungde",
      progress: "running",
      status: "SEDANG DICEK",
    },
  ],
};

interface SuratJalanDetailState {
  /** Get status steps for a Surat Jalan by referenceId (or URL slug converted to referenceId) */
  getSteps: (referenceId: string) => SuratJalanDetailStep[];
}

export const useSuratJalanDetailStore = create<SuratJalanDetailState>()(() => ({
  getSteps: (referenceId: string) => {
    const steps = SAMPLE_STEPS_BY_REFERENCE_ID[referenceId];
    return steps ?? DEFAULT_STEPS;
  },
}));
