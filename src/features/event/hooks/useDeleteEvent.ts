import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventRepository } from "@/repositories/eventRepository";
import { toast } from "sonner";

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: number) => eventRepository.deleteEvent(eventId),
        onSuccess: () => {
            toast.success("Event deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete event");
        },
    });
}
