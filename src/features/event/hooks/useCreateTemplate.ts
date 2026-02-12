import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Template } from "@/features/event/models/Template";
import { templateRepository } from "@/repositories/templateRepository";

export function useCreateTemplate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (template: Omit<Template, "id">) => templateRepository.createTemplate(template),
        onSuccess: () => {
            toast.success("Template created successfully");
            queryClient.invalidateQueries({ queryKey: ["templates"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create template");
        },
    });
}