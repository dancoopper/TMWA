import { eventRepository } from "@/repositories/eventRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { userRepository } from "@/repositories/userRepository";
import { useDashboardStore } from "@/stores/dashboardStore";
import { type Event } from "@/features/event/models/Event";

export function useCreateEvent() {
    const { session, userProfile } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            { name, description }: {
                name: string;
                description: string;
            },
        ) => {
            if (!session?.user.id) throw new Error("No active session");

            const userId = session?.user.id || userProfile?.id;

            if (!userId) {
                throw new Error("No event ID found");
            }

            return await eventRepository.createEvent({
                id: "",
                event_data: {
                    description,
                },
                template_id: 1,
                workspaces_id: 1,
            });
        },
        onSuccess: async (event) => {
            const userId = session?.user.id || userProfile?.id;

            if (userId) {
                queryClient.setQueryData<Event[]>(
                    ["events", userId],
                    (current) => {
                        const existing = current ?? [];
                        if (existing.some((item) => item.id === event.id)) {
                            return existing;
                        }
                        return [...existing, event];
                    },
                );
            }

            setSelectedEventId(event.id);

            if (userId) {
                try {
                    await userRepository.updateLatestEvent(userId, event.id);
                } catch (error) {
                    console.error("Failed to persist new workspace as latest:", error);
                }
            }

            toast.success("Workspace created successfully!");
            queryClient.invalidateQueries({
                queryKey: userId ? ["workspaces", userId] : ["workspaces"],
            });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
