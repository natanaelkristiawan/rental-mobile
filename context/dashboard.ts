import { GlobalInterface } from "@/lib/interface";

export interface DashboardStatCard {
  title: string;
  value: string;
  icon: "package" | "truck" | "map-pin" | "warehouse";
}

/** Dummy API response shape (replace with real fetch when backend is ready) */
const dummyDashboardResponse: GlobalInterface<DashboardStatCard[]> = {
  statusCode: 200,
  message: "OK",
  data: [
    { title: "Siap kirim", value: "1", icon: "package" },
    { title: "Dikirim", value: "2", icon: "truck" },
    { title: "Diterima di lokasi", value: "3", icon: "map-pin" },
    { title: "Kembali ke gudang", value: "2", icon: "warehouse" },
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
