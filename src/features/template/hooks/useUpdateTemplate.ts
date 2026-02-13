import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { templateRepository } from "@/repositories/templateRepository";
import type { TemplateField } from "@/features/template/templateFields";

export function useUpdateTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            name,
            data,
            isHidden,
        }: {
            id: number;
            name?: string;
            data?: TemplateField[];
            isHidden?: boolean;
        }) => templateRepository.updateTemplate(id, { name, data, isHidden }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["templates"],
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update template");
        },
    });
}
