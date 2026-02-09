import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceRepository } from "@/repositories/workspaceRepository";
import { toast } from "sonner";
import { type Workspace } from "../models/Workspace";

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Workspace> }) =>
            workspaceRepository.updateWorkspace(id, updates),
        onSuccess: () => {
            toast.success("Workspace updated successfully");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update workspace");
        },
    });
}
