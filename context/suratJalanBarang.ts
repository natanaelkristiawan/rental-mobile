import { create } from "zustand";
import { api } from "@/lib/api";

/** Single item for widget-detail-barang (detail barang per Surat Jalan) */
export interface SuratJalanBarangItem {
  name: string;
  details?: string;
  quantity: number | string;
  unit?: string;
}

const DEFAULT_BARANG: SuratJalanBarangItem[] = [];

interface SuratJalanBarangState {
  items: SuratJalanBarangItem[];
  loading: boolean;
  error: string | null;
  /** Fetch barang list for a Surat Jalan by numeric id */
  fetch: (id: number | string) => Promise<void>;
}

export const useSuratJalanBarangStore = create<SuratJalanBarangState>()((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetch: async (id: number | string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<{
        message?: string;
        data?: SuratJalanBarangItem[];
      }>(`/api/mobile/sj/${id}/barang`);

      const items = data?.data ?? [];

      set((state) => ({
        items: items,
        loading: false,
        error: null,
      }));
      

    } catch (err) {
      set({ loading: false, error: "Failed to load barang" });
    }
  }
}));
