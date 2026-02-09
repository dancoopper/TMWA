import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceRepository } from "@/repositories/workspaceRepository";
import { toast } from "sonner";

export function useDeleteWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workspaceId: number) => workspaceRepository.deleteWorkspace(workspaceId),
        onSuccess: () => {
            toast.success("Workspace deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete workspace");
        },
    });
}
