import { create } from "zustand";
import { GlobalInterface } from "@/lib/interface";

/** Status titles used by dashboard and Surat Jalan */
export const DASHBOARD_STATUS_TITLES = [
  "SIAP",
  "KIRIM",
  "LOKASI",
  "CEK",
  "OK",
] as const;
export type DashboardStatusTitle = (typeof DASHBOARD_STATUS_TITLES)[number];

export interface DashboardStatCard {
  title: DashboardStatusTitle;
  value: string;
  icon: "package" | "truck" | "map-pin" | "warehouse" | "circle-check";
}

/** Dummy API response shape (replace with real fetch when backend is ready) */
const dummyDashboardResponse: GlobalInterface<DashboardStatCard[]> = {
  statusCode: 200,
  message: "OK",
  data: [
    { title: "SIAP", value: "1", icon: "package" },
    { title: "KIRIM", value: "2", icon: "truck" },
    { title: "LOKASI", value: "3", icon: "map-pin" },
    { title: "CEK", value: "2", icon: "warehouse" },
    { title: "OK", value: "2", icon: "circle-check" },
  ],
};

/**
 * Fetches dashboard cards. Dummy implementation: returns static data after a short delay.
 * Replace with real API call: fetch("/api/dashboard/cards").then((r) => r.json())
 */
export async function getDashboardCards(): Promise<
  GlobalInterface<DashboardStatCard[]>
> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return dummyDashboardResponse;
}

/** Static list for non-async usage (e.g. SSR or fallback) */
export const dashboardCards: DashboardStatCard[] =
  dummyDashboardResponse.data;

interface DashboardState {
  cards: DashboardStatCard[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  cards: [],
  loading: false,
  error: null,
  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getDashboardCards();
      if (res.statusCode >= 400) {
        set({
          cards: [],
          error: res.message ?? "Failed to load",
          loading: false,
        });
        return;
      }
      set({
        cards: res.data ?? [],
        loading: false,
        error: null,
      });
    } catch {
      set({
        cards: [],
        loading: false,
        error: "Failed to load dashboard",
      });
    }
  },
}));
