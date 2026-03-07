import { create } from "zustand";
import { persist } from "zustand/middleware";

import { GlobalInterface } from "@/lib/interface";

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
                    // --- Dummy login (remove when using API) ---
                    const DUMMY_EMAIL = "user@wap.com";
                    const DUMMY_PASSWORD = "12345678";
                    if (email.trim() !== DUMMY_EMAIL || password !== DUMMY_PASSWORD) {
                        throw new Error("Invalid email or password");
                    }
                    const token = "dummy-token-" + Date.now();
                    const user: User = {
                        id: "1",
                        email: DUMMY_EMAIL,
                        name: "Demo User",
                    };
                    if (typeof document !== "undefined") {
                        document.cookie = `auth-token=${token}; path=/; max-age=2592000; samesite=strict`;
                    }
                    set({
                        user,
                        token,
                        isLoading: false,
                        error: null,
                    });
                    return;
                    // --- Uncomment below to use API instead ---
                    /*
                    const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const result: GlobalInterface<AuthResponse> = await response.json();

                    if (!response.ok || (result.statusCode && result.statusCode >= 400)) {
                        throw new Error(result.message || "Failed to login");
                    }

                    const token = result.data.token;
                    if (typeof document !== "undefined") {
                        document.cookie = `auth-token=${token}; path=/; max-age=2592000; samesite=strict`;
                    }

                    set({
                        user: result.data.user,
                        token,
                        isLoading: false,
                        error: null,
                    });
                    */
                } catch (error: any) {
                    set({
                        error: error.message || "An error occurred during login",
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
                    const response = await fetch("/api/auth/profile", {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${useAuthStore.getState().token}`,
                        },
                        body: JSON.stringify({
                            name: payload.name,
                            email: payload.email,
                            phone: payload.phone,
                            newPassword: payload.newPassword,
                        }),
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.message || "Failed to update profile");
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
