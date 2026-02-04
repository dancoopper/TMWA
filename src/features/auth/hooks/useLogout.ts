import { authRepository } from "@/repositories/authRepository";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogout() {
    return useMutation({
        mutationFn: authRepository.logout,
        onSuccess: () => {
            toast.success("Logged out successfully!");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
