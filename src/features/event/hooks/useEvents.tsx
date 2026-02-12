import { eventRepository } from "@/repositories/eventRepository";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "../models/Event";

interface UseEventsProps {
    startDate: Date;
    endDate: Date;
}

export function useEvents({
    startDate,
    endDate,
}: UseEventsProps) {
    const selectedWorkspaceId = useDashboardStore((state) => state.selectedWorkspaceId);
    const userId = useAuthStore((state) => state.session?.user.id);

    return useQuery<Event[]>({
        queryKey: ["events", selectedWorkspaceId ?? "none", startDate.toISOString(), endDate.toISOString()],
        queryFn: async () => {
            if (!selectedWorkspaceId || !userId) return [];
            const events = await eventRepository.getEventsByRange(selectedWorkspaceId, startDate, endDate);
            return events;
        },
        enabled: !!selectedWorkspaceId && !!userId,
    });
}