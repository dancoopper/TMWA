import { authRepository } from "@/repositories/authRepository";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin() {
    return useMutation({
        mutationFn: authRepository.login,
        onSuccess: (data) => {
            if (!data.session) {
                toast.success(
                    "Login successful!",
                );
            } else {
                toast.success(
                    "Login successful!",
                );
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}