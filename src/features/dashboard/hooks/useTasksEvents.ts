import { eventRepository } from "@/repositories/eventRepository";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/features/event/models/Event";
import { useMemo } from "react";

function tasksWindow(): { start: Date; end: Date } {
    const start = new Date();
    start.setDate(start.getDate() - 60);
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setDate(end.getDate() + 120);
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

/**
 * Events for Tasks list/board (wide date window). Uses same invalidation prefix as calendar `["events", ...]`.
 */
export function useTasksEvents() {
    const selectedWorkspaceId = useDashboardStore((s) => s.selectedWorkspaceId);
    const userId = useAuthStore((s) => s.session?.user.id);
    const { start, end } = useMemo(() => tasksWindow(), []);

    return useQuery<Event[]>({
        queryKey: ["events", "tasks", selectedWorkspaceId ?? "none", start.toISOString(), end.toISOString()],
        queryFn: async () => {
            if (!selectedWorkspaceId || !userId) return [];
            return eventRepository.getEventsByRange(selectedWorkspaceId, start, end);
        },
        enabled: !!selectedWorkspaceId && !!userId,
    });
}
