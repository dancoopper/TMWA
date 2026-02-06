import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { authRepository } from "@/repositories/authRepository";
import { userRepository } from "@/repositories/userRepository";
import type { UserProfile } from "@/features/auth/models/UserProfile";

type AuthState = {
    session: Session | null;
    userProfile: UserProfile | null;
    loading: boolean;
    initialize: () => Promise<void>;
    setUserProfile: (profile: UserProfile | null) => void;
};

const POSTGRES_PROFILE_NOT_FOUND_CODE = "PGRST116";

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    userProfile: null,
    loading: true,

    setUserProfile: (profile) => set({ userProfile: profile }),

    initialize: async () => {
        const fetchProfile = async (userId: string) => {
            try {
                return await userRepository.getProfile(userId);
            } catch (error: unknown) {
                const supabaseError = error as { code?: string; message?: string };
                if (supabaseError.code === POSTGRES_PROFILE_NOT_FOUND_CODE || supabaseError.message?.includes("not found")) {
                    return await userRepository.createProfile(userId);
                }
                throw error;
            }
        };

        try {
            const session = await authRepository.getSession();
            let userProfile: UserProfile | null = null;

            if (session) {
                userProfile = await fetchProfile(session.user.id);
            }

            set({ session, userProfile, loading: false });
        } catch (error) {
            console.error("Error initializing auth store:", error);
            set({ loading: false });
        }

        authRepository.onAuthStateChange(async (session) => {
            let userProfile: UserProfile | null = null;
            if (session) {
                try {
                    userProfile = await fetchProfile(session.user.id);
                } catch (error) {
                    console.error("Error fetching/creating profile on auth change:", error);
                }
            }
            set({ session, userProfile, loading: false });
        });
    },
}));
