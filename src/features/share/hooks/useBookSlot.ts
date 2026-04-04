import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { availabilityShareRepository } from "@/repositories/availabilityShareRepository";

export function useBookSlot(shareId: string) {
    const queryClient = useQueryClient();

    const bookSlot = useMutation({
        mutationFn: async ({
            bookerName,
            bookerEmail,
            slotStart,
            slotEnd,
        }: {
            bookerName: string;
            bookerEmail: string;
            slotStart: Date;
            slotEnd: Date;
        }) => {
            return availabilityShareRepository.createBooking(
                shareId,
                bookerName,
                bookerEmail,
                slotStart,
                slotEnd,
            );
        },
        onSuccess: () => {
            toast.success("Booking confirmed!");
            // Refresh the free-slots view
            queryClient.invalidateQueries({ queryKey: ["find-a-time", shareId] });
            // Refresh the dashboard calendar so the new event appears immediately
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
        onError: (err: Error) => {
            toast.error(err.message);
        },
    });

    return { bookSlot };
}
