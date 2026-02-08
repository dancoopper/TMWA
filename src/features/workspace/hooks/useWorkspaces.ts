import { useQuery } from "@tanstack/react-query";
import { workspaceRepository } from "@/repositories/workspaceRepository";
import { useAuthStore } from "@/stores/authStore";

export function useWorkspaces() {
    const { session } = useAuthStore();
    const userId = session?.user.id;

    return useQuery({
        queryKey: ["workspaces", userId],
        queryFn: async () => {
            if (!userId) return [];
            return workspaceRepository.getUserWorkspaces(userId);
        },
        enabled: !!userId,
    });
}
