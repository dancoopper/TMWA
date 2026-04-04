import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventRepository } from "@/repositories/eventRepository";
import type { EventFieldValue } from "@/features/event/eventFieldValues";
import type { EventColorKey } from "@/features/event/models/Event";

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
            colorKey,
        }: {
            id: number;
            title: string;
            start: Date;
            end: Date;
            data?: EventFieldValue[];
            templateId?: number;
            colorKey?: EventColorKey;
        }) => eventRepository.updateEvent(id, { title, start, end, data, templateId, colorKey }),
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
