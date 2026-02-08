import { workspaceRepository } from "@/repositories/workspaceRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export function useCreateWorkspace() {
    const { session, userProfile } = useAuthStore();
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
        onSuccess: () => {
            toast.success("Workspace created successfully!");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
