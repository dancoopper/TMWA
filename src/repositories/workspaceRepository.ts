import { supabase } from "@/lib/supabase";
import { toWorkspace } from "@/features/workspace/mappers/toWorkspace";
import { type Workspace } from "@/features/workspace/models/Workspace";
import { toWorkspaceMember } from "@/features/workspace/mappers/toWorkspaceMember";
import { type WorkspaceMember } from "@/features/workspace/models/WorkspaceMember";

export const workspaceRepository = {
    async getUserWorkspaces(userId: string): Promise<Workspace[]> {
        const { data, error } = await supabase
            .from("workspaces")
            .select(`
                *,
                workspace_members!inner(user_id)
            `)
            .eq("workspace_members.user_id", userId);

        if (error) throw error;
        return (data || []).map(toWorkspace);
    },

    async getWorkspaceById(id: number): Promise<Workspace> {
        const { data, error } = await supabase
            .from("workspaces")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        if (!data) throw new Error("Workspace not found");

        return toWorkspace(data);
    },

    async createWorkspace(name: string, description: string, ownerUserId: string): Promise<Workspace> {
        const { data, error } = await supabase
            .from("workspaces")
            .insert({
                name,
                description,
                owner_user_id: ownerUserId,
            })
            .select()
            .single();

        if (error) throw error;

        // Also add the owner as a member with editor role
        await this.addWorkspaceMember(data.id, ownerUserId, true, "editor", false);

        return toWorkspace(data);
    },

    async updateWorkspace(id: number, updates: Partial<Workspace>): Promise<void> {
        const { error } = await supabase
            .from("workspaces")
            .update({
                name: updates.name,
                description: updates.description,
            })
            .eq("id", id);

        if (error) throw error;
    },

    async deleteWorkspace(id: number): Promise<void> {
        const { error } = await supabase
            .from("workspaces")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    async getWorkspaceMembers(workspaceId: number): Promise<(WorkspaceMember & { firstName: string | null; lastName: string | null })[]> {
        const { data, error } = await supabase
            .from("workspace_members")
            .select(`
                *,
                user_profiles!inner(first_name, last_name)
            `)
            .eq("workspace_id", workspaceId);

        if (error) throw error;

        return (data || []).map((row) => {
            const profile = row.user_profiles as { first_name: string | null; last_name: string | null } | null;
            return {
                ...toWorkspaceMember(row),
                firstName: profile?.first_name ?? null,
                lastName: profile?.last_name ?? null,
            };
        });
    },

    async addWorkspaceMember(
        workspaceId: number,
        userId: string,
        isOwner: boolean = false,
        role: "viewer" | "editor" = "viewer",
        hideEvents: boolean = false,
    ): Promise<void> {
        const { error } = await supabase
            .from("workspace_members")
            .insert({
                workspace_id: workspaceId,
                user_id: userId,
                is_owner: isOwner,
                role,
                hide_events: hideEvents,
            });

        if (error) throw error;
    },

    async updateWorkspaceMember(
        memberId: number,
        updates: { role?: "viewer" | "editor"; hideEvents?: boolean },
    ): Promise<void> {
        const { error } = await supabase
            .from("workspace_members")
            .update({
                ...(updates.role !== undefined && { role: updates.role }),
                ...(updates.hideEvents !== undefined && { hide_events: updates.hideEvents }),
            })
            .eq("id", memberId);

        if (error) throw error;
    },

    async removeWorkspaceMember(workspaceId: number, userId: string): Promise<void> {
        const { error } = await supabase
            .from("workspace_members")
            .delete()
            .eq("workspace_id", workspaceId)
            .eq("user_id", userId);

        if (error) throw error;
    },

    async getUserIdByEmail(email: string): Promise<string | null> {
        const { data, error } = await supabase
            .rpc("get_user_id_by_email", { p_email: email });

        if (error) throw error;
        return data as string | null;
    },
};
