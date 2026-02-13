import { eventRepository } from "@/repositories/eventRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import { templateRepository } from "@/repositories/templateRepository";
import type { EventFieldValue } from "@/features/event/eventFieldValues";
import type { TemplateField } from "@/features/template/templateFields";

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
                date,
                data,
                selectedTemplateId,
                schema,
                saveAsTemplateName,
            }: {
                title: string;
                date: Date;
                data: EventFieldValue[];
                selectedTemplateId?: number;
                schema: TemplateField[];
                saveAsTemplateName?: string;
            },
        ) => {
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

            return await eventRepository.createEvent({
                title: title.trim(),
                date,
                workspaceId: selectedWorkspaceId,
                templateId,
                data,
            });
        },
        onSuccess: async (event) => {
            selectEvent(event);
            toast.success("Event created successfully!");
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
