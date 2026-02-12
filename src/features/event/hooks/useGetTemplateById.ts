import { useQuery } from "@tanstack/react-query";
import { templateRepository } from "@/repositories/templateRepository";

export const useGetTemplateById = (id: number) => {
    return useQuery({
        queryKey: ["template", id],
        queryFn: () => templateRepository.getTemplateById(id),
    });
};