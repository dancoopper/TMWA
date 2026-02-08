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

        // Also add the owner as a member
        await this.addWorkspaceMember(data.id, ownerUserId, true);
        
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

    async getWorkspaceMembers(workspaceId: number): Promise<WorkspaceMember[]> {
        const { data, error } = await supabase
            .from("workspace_members")
            .select("*")
            .eq("workspace_id", workspaceId);

        if (error) throw error;
        return (data || []).map(toWorkspaceMember);
    },

    async addWorkspaceMember(workspaceId: number, userId: string, isOwner: boolean = false): Promise<void> {
        const { error } = await supabase
            .from("workspace_members")
            .insert({
                workspace_id: workspaceId,
                user_id: userId,
                is_owner: isOwner,
            });

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
};
