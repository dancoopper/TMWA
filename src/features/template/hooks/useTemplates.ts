import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { templateRepository } from "@/repositories/templateRepository";
import type { Template } from "@/features/template/Template";

export function useTemplates(options?: { includeHidden?: boolean }) {
    const userId = useAuthStore((state) => state.session?.user.id);
    const includeHidden = options?.includeHidden ?? false;

    return useQuery<Template[]>({
        queryKey: ["templates", userId ?? "none", includeHidden ? "all" : "visible"],
        queryFn: async () => {
            if (!userId) return [];
            return templateRepository.getTemplatesByUserId(userId, { includeHidden });
        },
        enabled: !!userId,
    });
}
