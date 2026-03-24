import { create } from "zustand";
import { GlobalInterface } from "@/lib/interface";
import type { DashboardStatusTitle } from "@/context/dashboard";
import { api } from "@/lib/api";

/** Icon key aligned with dashboard stat cards */
export type SuratJalanStatusIcon =
  | "package"
  | "truck"
  | "map-pin"
  | "warehouse"
  | "circle-check";

/** API shape for a single Surat Jalan item (maps to CardSJProps) */
export interface SuratJalanItem {
  /** Database ID of Surat Jalan */
  id: number;
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
  ],
};

/** Payload for updating Surat Jalan status (PIC, status, signature) */
export interface UpdateSuratJalanStatusPayload {
  /** PIC id from list, or empty when "other" is selected */
  picId: string;
  /** PIC display name (from list item or from "other" text input) */
  picName: string;
  /** Numeric action index (0–3) */
  statusId: number;
  /** Action key string (e.g. "kirim", "lokasi", "cek", "ok") sent to BE as statusId */
  action?: string;
  /** Signature canvas as base64 data URL (e.g. image/png;base64,...) or null if not signed */
  signImage: string | null;
  /** Client receiver name for lokasi step */
  clientName?: string;
  /** Client receiver signature image as base64 data URL */
  signPenerimaImage?: string | null;
}

/** Build detail page path from numeric id (e.g. 123 -> /surat-jalan/123) */
export function getSuratJalanDetailPath(id: number | string): string {
  return `/surat-jalan/${id}`;
}

/**
 * Fetches Surat Jalan list from GET /api/mobile/sj.
 */
export async function getSuratJalanList(): Promise<
  GlobalInterface<SuratJalanItem[]>
> {
  try {
    const { data } = await api.get<{
      message?: string;
      data?: SuratJalanItem[];
    }>("/api/mobile/sj");
    return {
      statusCode: 200,
      message: data?.message ?? "OK",
      data: data?.data ?? [],
    };
  } catch {
    return dummySuratJalanResponse;
  }
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
      const { data } = await api.put<{ message: string; info?: string }>(
        `/api/mobile/sj/${encodeURIComponent(referenceId)}/status`,
        {
          statusId: payload.action ?? payload.statusId,
          picId: payload.picId,
          picName: payload.picName,
          signImage: payload.signImage,
          clientName: payload.clientName,
          signPenerimaImage: payload.signPenerimaImage,
        }
      );
      if (data?.message !== "success") {
        throw new Error(data?.info ?? data?.message ?? "Gagal update status");
      }
      set({ isUpdating: false, updateError: null, modalSuccess: true });
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
