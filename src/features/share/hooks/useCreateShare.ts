import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { availabilityShareRepository } from "@/repositories/availabilityShareRepository";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useAuthStore } from "@/stores/authStore";

export function useCreateShare() {
    const selectedWorkspaceId = useDashboardStore((s) => s.selectedWorkspaceId);
    const userId = useAuthStore((s) => s.session?.user.id);

    const createShare = useMutation({
        mutationFn: async ({
            startDate,
            endDate,
            label,
        }: {
            startDate: Date;
            endDate: Date;
            label?: string;
        }) => {
            if (!selectedWorkspaceId) throw new Error("No workspace selected");
            if (!userId) throw new Error("Not authenticated");

            const share = await availabilityShareRepository.createShare(
                selectedWorkspaceId,
                userId,
                startDate,
                endDate,
                label,
            );

            const link = `${window.location.origin}/availability/${share.id}`;
            return { share, link };
        },
        onError: (err: Error) => {
            toast.error(err.message);
        },
    });

    return { createShare };
}
