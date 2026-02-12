import { eventRepository } from "@/repositories/eventRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type Event } from "@/features/event/models/Event";


export function useCreateEvent() {
    const queryClient = useQueryClient();



    return useMutation({
        mutationFn: async (event: Omit<Event, "id">) => {

            return await eventRepository.createEvent(event);
        },
        onSuccess: async (event) => {
            toast.success("Event created successfully");
            queryClient.invalidateQueries({
                queryKey: ["events", event.workspaceId]
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
