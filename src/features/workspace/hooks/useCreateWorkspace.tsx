import { workspaceRepository } from "@/repositories/workspaceRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { userRepository } from "@/repositories/userRepository";
import { useDashboardStore } from "@/stores/dashboardStore";
import { type Workspace } from "@/features/workspace/models/Workspace";

export function useCreateWorkspace() {
    const { session, userProfile } = useAuthStore();
    const { setSelectedWorkspaceId } = useDashboardStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            { name, description }: {
                name: string;
                description: string;
            },
        ) => {
            if (!session?.user.id) throw new Error("No active session");

            const userId = session?.user.id || userProfile?.id;

            if (!userId) {
                throw new Error("No user ID found");
            }

            return await workspaceRepository.createWorkspace(
                name,
                description,
                userId,
            );
        },
        onSuccess: async (workspace) => {
            const userId = session?.user.id || userProfile?.id;

            if (userId) {
                queryClient.setQueryData<Workspace[]>(
                    ["workspaces", userId],
                    (current) => {
                        const existing = current ?? [];
                        if (existing.some((item) => item.id === workspace.id)) {
                            return existing;
                        }
                        return [...existing, workspace];
                    },
                );
            }

            setSelectedWorkspaceId(workspace.id);

            if (userId) {
                try {
                    await userRepository.updateLatestWorkspace(userId, workspace.id);
                } catch (error) {
                    console.error("Failed to persist new workspace as latest:", error);
                }
            }

            toast.success("Workspace created successfully!");
            queryClient.invalidateQueries({
                queryKey: userId ? ["workspaces", userId] : ["workspaces"],
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
