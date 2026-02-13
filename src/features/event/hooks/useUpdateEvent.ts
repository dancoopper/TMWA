import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventRepository } from "@/repositories/eventRepository";

export function useUpdateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            title,
            date,
        }: {
            id: number;
            title: string;
            date: Date;
        }) => eventRepository.updateEvent(id, { title, date }),
        onSuccess: async () => {
            toast.success("Event updated successfully!");
            await queryClient.invalidateQueries({
                queryKey: ["events"],
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update event");
        },
    });
}
