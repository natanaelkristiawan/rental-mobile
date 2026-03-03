import { create } from "zustand";
import { GlobalInterface } from "@/lib/interface";
import type { DashboardStatusTitle } from "@/context/dashboard";

/** Icon key aligned with dashboard stat cards */
export type SuratJalanStatusIcon =
  | "package"
  | "truck"
  | "map-pin"
  | "warehouse"
  | "circle-check";

/** API shape for a single Surat Jalan item (maps to CardSJProps) */
export interface SuratJalanItem {
  /** Status label; use dashboard status titles (SIAP, KIRIM, LOKASI, CEK, OK) */
  status: DashboardStatusTitle;
  referenceId: string;
  clientName: string;
  location: string;
  itemCount: string;
  statusIcon?: SuratJalanStatusIcon;
}

/** Dummy API response (replace with real fetch when backend is ready) */
const dummySuratJalanResponse: GlobalInterface<SuratJalanItem[]> = {
  statusCode: 200,
  message: "OK",
  data: [
    {
      status: "SIAP",
      referenceId: "SJLED/d4e56f11-xyz4-7zzk-a1b2-1234567890ab",
      clientName: "PT Maju Jaya",
      location: "Grand Hyatt Bali",
      itemCount: "2 item barang",
      statusIcon: "package",
    },
    {
      status: "KIRIM",
      referenceId: "SJLED/e5f67g22-yza5-8aal-b2c3-2345678901bc",
      clientName: "CV Sentosa",
      location: "The Ritz-Carlton Jakarta",
      itemCount: "3 item barang",
      statusIcon: "truck",
    },
    {
      status: "LOKASI",
      referenceId: "SJLED/f6g78h33-azb6-9bbm-c3d4-3456789012cd",
      clientName: "PT Harmoni",
      location: "Four Seasons Bali",
      itemCount: "1 item barang",
      statusIcon: "map-pin",
    },
  ],
};

/** Build detail page path from referenceId (e.g. SJLED/xxx -> /surat-jalan/SJLED-xxx) */
export function getSuratJalanDetailPath(referenceId: string): string {
  return `/surat-jalan/${referenceId.replace(/\//g, "-")}`;
}

/**
 * Fetches Surat Jalan list. Dummy implementation: returns static data after a short delay.
 * Replace with: fetch("/api/surat-jalan").then((r) => r.json())
 */
export async function getSuratJalanList(): Promise<
  GlobalInterface<SuratJalanItem[]>
> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return dummySuratJalanResponse;
}

interface SuratJalanState {
  items: SuratJalanItem[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useSuratJalanStore = create<SuratJalanState>()((set) => ({
  items: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getSuratJalanList();
      if (res.statusCode >= 400) {
        set({
          items: [],
          error: res.message ?? "Failed to load Surat Jalan",
          loading: false,
        });
        return;
      }
      set({
        items: res.data ?? [],
        loading: false,
        error: null,
      });
    } catch {
      set({
        items: [],
        loading: false,
        error: "Failed to load Surat Jalan",
      });
    }
  },
}));
