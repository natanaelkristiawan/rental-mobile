import { create } from "zustand";
import { GlobalInterface } from "@/lib/interface";
import { api } from "@/lib/api";

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

type DashboardApiData = Record<DashboardStatusTitle, number>;

const DEFAULT_DASHBOARD_CARDS: DashboardStatCard[] = [
  { title: "SIAP", value: "0", icon: "package" },
  { title: "KIRIM", value: "0", icon: "truck" },
  { title: "LOKASI", value: "0", icon: "map-pin" },
  { title: "CEK", value: "0", icon: "warehouse" },
  { title: "OK", value: "0", icon: "circle-check" },
];

/** Dummy API response shape (replace with real fetch when backend is ready) */
const dummyDashboardResponse: GlobalInterface<DashboardStatCard[]> = {
  statusCode: 200,
  message: "OK",
  data: DEFAULT_DASHBOARD_CARDS,
};

/**
 * Fetches dashboard cards. Calls GET /api/mobile/dashboard (counter widget).
 * Response is logged for debugging; still returns dummy data until response is applied.
 */
export async function getDashboardCards(): Promise<
  GlobalInterface<DashboardStatCard[]>
> {
  try {
    const { data } = await api.get<GlobalInterface<DashboardApiData>>(
      "/api/mobile/dashboard"
    );
    console.log("[getDashboardCards] API response:", data);
    if (data?.data != null) {
      const statusMap = data.data;
      const mergedCards: DashboardStatCard[] = DEFAULT_DASHBOARD_CARDS.map(
        (card) => {
          return {
            ...card,
            value:
              statusMap[card.title] !== undefined
                ? String(statusMap[card.title])
                : card.value,
          };
        }
      );

      return {
        ...data,
        data: mergedCards,
      };
    }
  } catch (err) {
    console.log("[getDashboardCards] API error:", err);
  }
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
  cards: DEFAULT_DASHBOARD_CARDS,
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
