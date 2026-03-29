import { create } from "zustand";
import type { SJStatusProgress } from "@/components/main/widget-sj-status";
import type { SuratJalanItem } from "@/context/suratJalan";
import { api } from "@/lib/api";

/** Detail item from GET /api/mobile/sj/:id (extends list item with event fields) */
export interface SuratJalanDetailItem extends SuratJalanItem {
  event_start_date?: string | null;
  event_end_date?: string | null;
  keterangan?: string | null;
  size?: string | null;
  pic_name?: string | null;
  pic_gudang?: string | null;
  pic_lapangan?: string | null;
}

/** Step data for widget-sj-status (no icon; widget uses default by index) */
export interface SuratJalanDetailStep {
  title: string;
  subtitle?: string;
  pic?: string;
  progress: SJStatusProgress;
  status?: string;
  /** From history API (YYYY-MM-DD HH:mm:ss) */
  createdAt?: string;
}

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

function isValidProgress(p: string): p is SJStatusProgress {
  return p === "finished" || p === "running" || p === "next";
}

interface SuratJalanDetailState {
  item: SuratJalanDetailItem | null;
  loading: boolean;
  error: string | null;
  /** Status steps from GET /api/mobile/sj/:id/history */
  steps: SuratJalanDetailStep[];
  /** Fetch single Surat Jalan by numeric id */
  fetch: (id: number | string) => Promise<void>;
  /** Load steps from history API (same id as detail) */
  fetchSteps: (id: number | string) => Promise<void>;
}

export const useSuratJalanDetailStore = create<SuratJalanDetailState>()(
  (set, get) => ({
    item: null,
    loading: false,
    error: null,
    steps: DEFAULT_STEPS,

    fetchSteps: async (id: number | string) => {
      const idStr = String(id);
      try {
        const { data } = await api.get<{
          data?: Array<{
            title: string;
            subtitle?: string;
            pic?: string;
            progress: string;
            status?: string;
            createdAt?: string;
          }>;
        }>(`/api/mobile/sj/${encodeURIComponent(idStr)}/history`);

        const raw = data?.data;
        if (!Array.isArray(raw) || raw.length === 0) {
          set({ steps: [...DEFAULT_STEPS] });
          return;
        }

        const steps: SuratJalanDetailStep[] = raw.map((row) => ({
          title: row.title,
          subtitle: row.subtitle,
          pic: row.pic,
          progress: isValidProgress(row.progress) ? row.progress : "next",
          ...(row.status ? { status: row.status } : {}),
          ...(row.createdAt ? { createdAt: row.createdAt } : {}),
        }));
        set({ steps });
      } catch {
        set({ steps: [...DEFAULT_STEPS] });
      }
    },

    fetch: async (id: number | string) => {
      const idStr = String(id);
      set({ loading: true, error: null, steps: [...DEFAULT_STEPS] });
      try {
        const { data } = await api.get<{
          message?: string;
          data?: SuratJalanDetailItem;
        }>(`/api/mobile/sj/${encodeURIComponent(idStr)}`);
        if (data?.data) {
          set({ item: data.data, loading: false, error: null });
          await get().fetchSteps(idStr);
        } else {
          set({
            item: null,
            loading: false,
            error: "Data not found",
            steps: [...DEFAULT_STEPS],
          });
        }
      } catch {
        set({
          item: null,
          loading: false,
          error: "Failed to load Surat Jalan detail",
          steps: [...DEFAULT_STEPS],
        });
      }
    },
  })
);
