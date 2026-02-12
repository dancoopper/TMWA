import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventRepository } from "@/repositories/eventRepository";
import { toast } from "sonner";
import { type Event } from "../models/Event";

export function useUpdateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Event> }) =>
            eventRepository.updateEvent(id, updates),
        onSuccess: (updatedEvent) => {
            toast.success("Event updated successfully");
            queryClient.invalidateQueries({ queryKey: ["events", updatedEvent.workspaceId] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update event");
        },
    });
}
