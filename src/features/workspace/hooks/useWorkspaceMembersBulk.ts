import { useQuery } from "@tanstack/react-query";
import { workspaceRepository } from "@/repositories/workspaceRepository";
import { useWorkspaces } from "./useWorkspaces";

export function useWorkspaceMembersBulk() {
    const { data: workspaces } = useWorkspaces();
    const ids = [...(workspaces?.map((w) => w.id) ?? [])].sort((a, b) => a - b);

    return useQuery({
        queryKey: ["workspace-members-bulk", ids],
        queryFn: () => workspaceRepository.getWorkspaceMembersByWorkspaceIds(ids),
        enabled: ids.length > 0,
    });
}
