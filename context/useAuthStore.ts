import { create } from "zustand";
import { persist } from "zustand/middleware";

import { GlobalInterface } from "@/lib/interface";
import { api } from "@/lib/api";

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    // Add other relevant user fields returned by your NestJS BE
}

export interface UpdateProfilePayload {
    name?: string;
    email?: string;
    phone?: string;
    newPassword?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            isUpdating: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { data: result } = await api.post<{
                        message: string;
                        info?: string;
                        data: { token: string; id: string; email: string; username: string };
                    }>("/api/auth/login", { email, password });

                    if (result.message !== "success") {
                        throw new Error(result.info || result.message || "Failed to login");
                    }

                    const data = result.data;
                    const token = data.token;

                    if (typeof document !== "undefined") {
                        document.cookie = `auth-token=${token}; path=/; max-age=2592000; samesite=strict`;
                    }

                    const user: User = {
                        id: String(data.id),
                        email: data.email,
                        name: data.username,
                    };

                    set({
                        user,
                        token,
                        isLoading: false,
                        error: null,
                    });
                } catch (error: any) {
                    const message =
                        error.response?.data?.info ||
                        error.response?.data?.message ||
                        error.message ||
                        "An error occurred during login";
                    set({
                        error: message,
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                if (typeof document !== "undefined") {
                    document.cookie = "auth-token=; path=/; max-age=0";
                }
                set({ user: null, token: null, error: null });
            },

            updateProfile: async (payload) => {
                set({ isUpdating: true, error: null });
                try {
                    const { user } = useAuthStore.getState();
                    if (!user) {
                        throw new Error("Not authenticated");
                    }
                    // --- Dummy update (replace with API call when ready) ---
                    const updatedUser: User = {
                        ...user,
                        ...(payload.name !== undefined && { name: payload.name }),
                        ...(payload.email !== undefined && { email: payload.email }),
                        ...(payload.phone !== undefined && { phone: payload.phone }),
                    };
                    set({
                        user: updatedUser,
                        isUpdating: false,
                        error: null,
                    });
                    // --- Uncomment below to use API instead ---
                    /*
                    const { data: result } = await api.patch<GlobalInterface<{ user: User }>>(
                        "/api/auth/profile",
                        {
                            name: payload.name,
                            email: payload.email,
                            phone: payload.phone,
                            newPassword: payload.newPassword,
                        }
                    );
                    if (result.statusCode >= 400) throw new Error(result.message || "Failed to update profile");
                    set({ user: result.data.user, isUpdating: false, error: null });
                    */
                } catch (error: any) {
                    set({
                        error: error.message || "Gagal memperbarui profil",
                        isUpdating: false,
                    });
                    throw error;
                }
            },
        }),
        {
            name: "auth-storage", // The key used in local storage
            partialize: (state) => ({ user: state.user, token: state.token }), // Persist only user and token to avoid keeping isLoading/error state on page refresh
        }
    )
);
