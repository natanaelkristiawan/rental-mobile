import { create } from "zustand";
import { GlobalInterface } from "@/lib/interface";
import { api } from "@/lib/api";
import { useAuthStore } from "@/context/useAuthStore";

export interface PicItem {
  id: string;
  name: string;
}

interface PicState {
  items: PicItem[];
  defaultSelectedId: string;
  isLoading: boolean;
  error: string | null;
  /** Fetch PIC list from GET /api/mobile/users */
  fetchPics: () => Promise<void>;
}

export const usePicStore = create<PicState>((set) => ({
  items: [],
  defaultSelectedId: "",
  isLoading: false,
  error: null,

  fetchPics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<GlobalInterface<PicItem[]>>("/api/mobile/users");
      const items = Array.isArray(data?.data) ? data.data : [];
      const loginUserId = useAuthStore.getState().user?.id ?? "";
      const defaultSelectedId = items.some((item) => item.id === loginUserId)
        ? loginUserId
        : "";
      set({
        items,
        defaultSelectedId,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : "Gagal memuat data PIC",
        isLoading: false,
      });
    }
  },
}));
