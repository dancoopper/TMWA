import { supabase } from "@/lib/supabase";
import { toUserProfile } from "@/features/auth/mappers/toUserProfile";
import { type UserProfile } from "@/features/auth/models/UserProfile";

export const authRepository = {
    async getProfile(userId: string): Promise<UserProfile> {
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;
        if (!data) throw new Error("User profile not found");

        return toUserProfile(data);
    },
};
