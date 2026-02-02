import { authRepository } from "@/repositories/authRepository";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSignup() {
    return useMutation({
        mutationFn: authRepository.signUp,
        onSuccess: (data) => {
            if (!data.session) {
                toast.success(
                    "Account created successfully! Please check your email for verification.",
                );
            } else {
                toast.success(
                    "Account created successfully! Please check your email for verification.",
                );
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
