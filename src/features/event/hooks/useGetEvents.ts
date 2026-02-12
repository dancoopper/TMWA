import { useQuery } from "@tanstack/react-query";
import { eventRepository } from "@/repositories/eventRepository";

export function useGetEvents(workspaceId?: number) {
    return useQuery({
        queryKey: ["events", workspaceId],
        queryFn: async () => {
            if (!workspaceId) return [];
            return eventRepository.getEvents(workspaceId);
        },
        enabled: !!workspaceId,
    });
}
