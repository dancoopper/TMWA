import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workspaceRepository } from "@/repositories/workspaceRepository";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useAuthStore } from "@/stores/authStore";

export function useShareWorkspace() {
    const selectedWorkspaceId = useDashboardStore((s) => s.selectedWorkspaceId);
    const session = useAuthStore((s) => s.session);
    const queryClient = useQueryClient();

    const invite = useMutation({
        mutationFn: async ({
            email,
            role,
            hideEvents,
        }: {
            email: string;
            role: "viewer" | "editor";
            hideEvents: boolean;
        }) => {
            if (!selectedWorkspaceId) throw new Error("No workspace selected");

            const userId = await workspaceRepository.getUserIdByEmail(email.trim().toLowerCase());
            if (!userId) throw new Error(`No account found for "${email}"`);
            if (userId === session?.user.id) throw new Error("You cannot invite yourself");

            const members = await workspaceRepository.getWorkspaceMembers(selectedWorkspaceId);
            if (members.some((m) => m.userId === userId)) {
                throw new Error("This user is already a member of this workspace");
            }

            await workspaceRepository.addWorkspaceMember(selectedWorkspaceId, userId, false, role, hideEvents);
        },
        onSuccess: () => {
            toast.success("User invited successfully!");
            queryClient.invalidateQueries({ queryKey: ["workspace-members", selectedWorkspaceId] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const updateMember = useMutation({
        mutationFn: async ({
            memberId,
            role,
            hideEvents,
        }: {
            memberId: number;
            role?: "viewer" | "editor";
            hideEvents?: boolean;
        }) => {
            await workspaceRepository.updateWorkspaceMember(memberId, { role, hideEvents });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace-members", selectedWorkspaceId] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const removeMember = useMutation({
        mutationFn: async (userId: string) => {
            if (!selectedWorkspaceId) throw new Error("No workspace selected");
            await workspaceRepository.removeWorkspaceMember(selectedWorkspaceId, userId);
        },
        onSuccess: () => {
            toast.success("Member removed.");
            queryClient.invalidateQueries({ queryKey: ["workspace-members", selectedWorkspaceId] });
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    return { invite, updateMember, removeMember };
}
