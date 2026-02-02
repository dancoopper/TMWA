import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { authRepository } from "@/repositories/authRepository";

type AuthState = {
    session: Session | null;
    loading: boolean;
    initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    loading: true,

    initialize: async () => {
        try {
            const session = await authRepository.getSession();
            set({ session, loading: false });
        } catch (error) {
            console.error("Error initializing auth store:", error);
        }

        authRepository.onAuthStateChange((session) => {
            set({ session, loading: false });
        });
    },
}));
