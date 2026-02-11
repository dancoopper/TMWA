import { supabase } from "@/lib/supabase";
import { toUserProfile } from "@/features/auth/mappers/toUserProfile";
import { type UserProfile } from "@/features/auth/models/UserProfile";
import { toUserWorkingSession } from "@/features/workspace/mappers/toUserWorkingSession";
import { type UserWorkingSession } from "@/features/workspace/models/UserWorkingSession";

export const userRepository = {
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

    async createProfile(userId: string): Promise<UserProfile> {
        const { data, error } = await supabase
            .from("user_profiles")
            .insert({ id: userId, is_onboarded: false })
            .select()
            .single();

        if (error) throw error;
        return toUserProfile(data);
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>) {
        const { error } = await supabase
            .from("user_profiles")
            .update({
                first_name: updates.firstName,
                last_name: updates.lastName,
                is_onboarded: updates.isOnboarded,
                timezone: updates.timezone,
            })
            .eq("id", userId);

        if (error) throw error;
    },

    async getWorkingSession(userId: string): Promise<UserWorkingSession | null> {
        const { data, error } = await supabase
            .from("user_working_sessions")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        return toUserWorkingSession(data);
    },

    async updateLatestWorkspace(userId: string, workspaceId: number | null): Promise<void> {
        const payload = {
            user_id: userId,
            latest_workspace_id: workspaceId,
        };

        const { error } = await supabase
            .from("user_working_sessions")
            .upsert(payload, {
                onConflict: "user_id"
            });

        if (!error) return;

        // Fallback for environments where user_id is not uniquely constrained yet.
        if (error.code !== "42P10") throw error;

        const { data: existingRows, error: selectError } = await supabase
            .from("user_working_sessions")
            .select("id")
            .eq("user_id", userId)
            .order("id", { ascending: false });

        if (selectError) throw selectError;

        if (existingRows.length > 0) {
            const [latestRow] = existingRows;

            const { error: updateError } = await supabase
                .from("user_working_sessions")
                .update({ latest_workspace_id: workspaceId })
                .eq("id", latestRow.id);

            if (updateError) throw updateError;

            // Keep one effective row for the user to mimic one-to-one behavior.
            if (existingRows.length > 1) {
                const staleIds = existingRows.slice(1).map((row) => row.id);
                const { error: deleteError } = await supabase
                    .from("user_working_sessions")
                    .delete()
                    .in("id", staleIds);

                if (deleteError) {
                    console.error("Failed cleaning duplicate user_working_sessions rows:", deleteError);
                }
            }

            return;
        }

        const { error: insertError } = await supabase
            .from("user_working_sessions")
            .insert(payload);

        if (insertError) throw insertError;
    },
};
