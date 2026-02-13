import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { templateRepository } from "@/repositories/templateRepository";
import type { TemplateField } from "@/features/template/templateFields";
import { useAuthStore } from "@/stores/authStore";

export function useCreateTemplate() {
    const queryClient = useQueryClient();
    const userId = useAuthStore((state) => state.session?.user.id);

    return useMutation({
        mutationFn: async ({
            name,
            data,
            isHidden,
        }: {
            name: string;
            data: TemplateField[];
            isHidden?: boolean;
        }) => {
            if (!userId) {
                throw new Error("No active session");
            }
            return templateRepository.createTemplate({
                userId,
                name,
                data,
                isHidden,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["templates"],
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create template");
        },
    });
}
