import { eventRepository } from "@/repositories/eventRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import { templateRepository } from "@/repositories/templateRepository";
import type { EventFieldValue } from "@/features/event/eventFieldValues";
import type { TemplateField } from "@/features/template/templateFields";
import type { Event } from "@/features/event/models/Event";
import { addDays } from "@/features/event/eventTimeRange";

function getReadableErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        const rawMessage = error.message?.trim();
        if (!rawMessage) return "Failed to create event";

        try {
            const parsed = JSON.parse(rawMessage) as unknown;
            if (
                Array.isArray(parsed) &&
                parsed.length > 0 &&
                typeof parsed[0] === "object" &&
                parsed[0] !== null &&
                "message" in parsed[0] &&
                typeof (parsed[0] as { message?: unknown }).message === "string"
            ) {
                return (parsed[0] as { message: string }).message;
            }
        } catch {
            // Ignore JSON parsing errors and return the raw error message.
        }

        return rawMessage;
    }

    return "Failed to create event";
}

export function useCreateEvent() {
    const { session, userProfile } = useAuthStore();
    const { selectedWorkspaceId, selectEvent } = useDashboardStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            {
                title,
                start,
                end,
                repeatWeekly,
                repeatWeeks,
                data,
                selectedTemplateId,
                schema,
                saveAsTemplateName,
            }: {
                title: string;
                start: Date;
                end: Date;
                repeatWeekly: boolean;
                repeatWeeks: number;
                data: EventFieldValue[];
                selectedTemplateId?: number;
                schema: TemplateField[];
                saveAsTemplateName?: string;
            },
        ): Promise<Event> => {
            if (!session?.user.id) throw new Error("No active session");
            if (!selectedWorkspaceId) throw new Error("Please select a workspace first");

            const userId = session?.user.id || userProfile?.id;

            if (!userId) {
                throw new Error("No user ID found");
            }

            let templateId = selectedTemplateId;

            if (saveAsTemplateName?.trim()) {
                const template = await templateRepository.createTemplate({
                    userId,
                    name: saveAsTemplateName.trim(),
                    data: schema,
                    isHidden: false,
                });
                templateId = template.id;
            }

            if (!templateId) {
                const hiddenTemplate = await templateRepository.createTemplate({
                    userId,
                    name: `Hidden template ${Date.now()}`,
                    data: schema,
                    isHidden: true,
                });
                templateId = hiddenTemplate.id;
            }

            const weeks = repeatWeekly ? Math.min(52, Math.max(1, repeatWeeks)) : 1;
            const durationMs = end.getTime() - start.getTime();
            if (durationMs <= 0) throw new Error("End time must be after start time");

            let last: Event | null = null;
            for (let w = 0; w < weeks; w++) {
                const s = addDays(start, w * 7);
                const e = new Date(s.getTime() + durationMs);
                last = await eventRepository.createEvent({
                    title: title.trim(),
                    start: s,
                    end: e,
                    workspaceId: selectedWorkspaceId,
                    templateId,
                    data,
                });
            }

            if (!last) throw new Error("No event created");
            return last;
        },
        onSuccess: async (event, variables) => {
            selectEvent(event);
            const n = variables.repeatWeekly
                ? Math.min(52, Math.max(1, variables.repeatWeeks))
                : 1;
            toast.success(
                n > 1 ? `Created ${n} weekly events` : "Event created successfully!",
            );
            await queryClient.invalidateQueries({
                queryKey: ["events"],
            });
            await queryClient.invalidateQueries({
                queryKey: ["templates"],
            });
        },
        onError: (error) => {
            toast.error(getReadableErrorMessage(error));
        },
    });
}
