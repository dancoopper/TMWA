import { userRepository } from "@/repositories/userRepository";
import { workspaceRepository } from "@/repositories/workspaceRepository";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { type UserProfile } from "../models/UserProfile";

export function useOnboarding() {
    const session = useAuthStore((state) => state.session);
    const setUserProfile = useAuthStore((state) => state.setUserProfile);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (updates: Partial<UserProfile>) => {
            if (!session?.user.id) throw new Error("No active session");

            await userRepository.updateProfile(session.user.id, {
                ...updates,
                isOnboarded: true,
            });

            // Create a default workspace for the new user.
            // Errors here are non-fatal — the user can always create a workspace manually.
            try {
                await workspaceRepository.createWorkspace(
                    "My Workspace",
                    "Default workspace",
                    session.user.id,
                );
            } catch (err) {
                console.error("Failed to create default workspace during onboarding:", err);
            }

            return await userRepository.getProfile(session.user.id);
        },
        onSuccess: (updatedProfile) => {
            setUserProfile(updatedProfile);
            toast.success("Profile updated successfully!");
            navigate(ROUTES.DASHBOARD);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}
