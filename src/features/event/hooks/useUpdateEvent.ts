import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventRepository } from "@/repositories/eventRepository";
import type { EventFieldValue } from "@/features/event/eventFieldValues";

export function useUpdateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            title,
            start,
            end,
            data,
            templateId,
        }: {
            id: number;
            title: string;
            start: Date;
            end: Date;
            data?: EventFieldValue[];
            templateId?: number;
        }) => eventRepository.updateEvent(id, { title, start, end, data, templateId }),
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
