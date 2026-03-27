import { useQuery } from "@tanstack/react-query";
import { workspaceRepository } from "@/repositories/workspaceRepository";
import { useDashboardStore } from "@/stores/dashboardStore";

export function useWorkspaceMembers() {
    const selectedWorkspaceId = useDashboardStore((s) => s.selectedWorkspaceId);

    return useQuery({
        queryKey: ["workspace-members", selectedWorkspaceId],
        queryFn: () => workspaceRepository.getWorkspaceMembers(selectedWorkspaceId!),
        enabled: selectedWorkspaceId !== null,
    });
}
