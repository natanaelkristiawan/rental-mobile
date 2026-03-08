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

/** Payload for updating Surat Jalan status (PIC, status, signature) */
export interface UpdateSuratJalanStatusPayload {
  /** PIC id from list, or empty when "other" is selected */
  picId: string;
  /** PIC display name (from list item or from "other" text input) */
  picName: string;
  /** Status/action id (e.g. 0–4 for action index, or server status id) */
  statusId: number;
  /** Signature canvas as base64 data URL (e.g. image/png;base64,...) or null if not signed */
  signImage: string | null;
}

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
  isUpdating: boolean;
  updateError: string | null;
  /** Show success modal after update succeeds */
  modalSuccess: boolean;
  /** Show failed modal after update fails */
  modalFailed: boolean;
  fetch: () => Promise<void>;
  /** Update Surat Jalan status: send picId, picName, statusId, signImage to server */
  updateStatus: (
    referenceId: string,
    payload: UpdateSuratJalanStatusPayload
  ) => Promise<void>;
  /** Close success modal */
  closeSuccessModal: () => void;
  /** Close failed modal */
  closeFailedModal: () => void;
}

export const useSuratJalanStore = create<SuratJalanState>()((set) => ({
  items: [],
  loading: false,
  error: null,
  isUpdating: false,
  updateError: null,
  modalSuccess: false,
  modalFailed: false,

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

  updateStatus: async (referenceId, payload) => {
    set({ isUpdating: true, updateError: null });
    try {
      // --- Dummy: simulate API call (replace with real fetch when backend is ready) ---
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Example request body: { referenceId, picId, picName, statusId, signImage }
      const body = {
        referenceId,
        picId: payload.picId,
        picName: payload.picName,
        statusId: payload.statusId,
        signImage: payload.signImage,
      };
      if (process.env.NODE_ENV === "development") {
        console.log("[SuratJalan] updateStatus payload", body);
      }
      // Simulate success; replace with:
      // const response = await fetch("/api/surat-jalan/update-status", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(body),
      // });
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message ?? "Gagal update status");
      set({ isUpdating: false, updateError: null, modalSuccess: true });
      // Optionally refresh list or update local item status here
      return;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memperbarui status surat jalan";
      set({ isUpdating: false, updateError: message, modalFailed: true });
      throw err;
    }
  },

  closeSuccessModal: () => set({ modalSuccess: false }),
  closeFailedModal: () => set({ modalFailed: false }),
}));
