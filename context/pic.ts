import { create } from "zustand";
import { GlobalInterface } from "@/lib/interface";

export interface PicItem {
  id: string;
  name: string;
}

interface PicState {
  items: PicItem[];
  isLoading: boolean;
  error: string | null;
  /** Fetch PIC list (static data first; replace with API when ready) */
  fetchPics: () => Promise<void>;
}

/** Static/dummy PIC list (replace with API response shape when ready) */
const dummyPicResponse: GlobalInterface<PicItem[]> = {
  statusCode: 200,
  message: "OK",
  data: [
    { id: "1", name: "Ahmad Wijaya" },
    { id: "2", name: "Budi Santoso" },
    { id: "3", name: "Citra Dewi" },
    { id: "4", name: "Dian Pratama" },
    { id: "5", name: "Eko Prasetyo" },
  ],
};

export const usePicStore = create<PicState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchPics: async () => {
    set({ isLoading: true, error: null });
    try {
      // --- Static first (replace with API when ready) ---
      await new Promise((r) => setTimeout(r, 300)); // simulate delay
      set({
        items: dummyPicResponse.data,
        isLoading: false,
        error: null,
      });
      // --- Uncomment below to use API instead ---
      /*
      const response = await fetch("/api/pics");
      const result: GlobalInterface<PicItem[]> = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to load PIC");
      set({ items: result.data, isLoading: false, error: null });
      */
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : "Gagal memuat data PIC",
        isLoading: false,
      });
    }
  },
}));
