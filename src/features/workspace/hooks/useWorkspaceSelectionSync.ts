import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { userRepository } from "@/repositories/userRepository";

export function useWorkspaceSelectionSync() {
    const { session } = useAuthStore();
    const userId = session?.user.id ?? null;
    const { data: workspaces, isFetching } = useWorkspaces();
    const { selectedWorkspaceId, setSelectedWorkspaceId } = useDashboardStore();

    const hasHydratedRef = useRef(false);
    const lastPersistedWorkspaceIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!userId) {
            hasHydratedRef.current = false;
            lastPersistedWorkspaceIdRef.current = null;
            if (selectedWorkspaceId !== null) {
                setSelectedWorkspaceId(null);
            }
            return;
        }

        if (!workspaces) return;

        if (workspaces.length === 0) {
            hasHydratedRef.current = true;
            if (selectedWorkspaceId !== null) {
                setSelectedWorkspaceId(null);
            }
            return;
        }

        if (hasHydratedRef.current) return;

        let isCancelled = false;

        const hydrate = async () => {
            try {
                const workingSession = await userRepository.getWorkingSession(userId);
                if (isCancelled) return;

                const persistedWorkspaceId = workingSession?.latestWorkspaceId ?? null;
                lastPersistedWorkspaceIdRef.current = persistedWorkspaceId;

                const hasPersistedWorkspace = persistedWorkspaceId !== null &&
                    workspaces.some((workspace) => workspace.id === persistedWorkspaceId);
                const nextWorkspaceId = hasPersistedWorkspace
                    ? persistedWorkspaceId
                    : workspaces[0].id;

                setSelectedWorkspaceId(nextWorkspaceId);
            } catch (error) {
                if (isCancelled) return;
                console.error("Failed to hydrate workspace selection:", error);
                setSelectedWorkspaceId(workspaces[0].id);
            } finally {
                if (!isCancelled) {
                    hasHydratedRef.current = true;
                }
            }
        };

        hydrate();

        return () => {
            isCancelled = true;
        };
    }, [userId, workspaces, selectedWorkspaceId, setSelectedWorkspaceId]);

    useEffect(() => {
        if (!hasHydratedRef.current || !workspaces?.length || isFetching) return;

        const hasSelectedWorkspace = selectedWorkspaceId !== null &&
            workspaces.some((workspace) => workspace.id === selectedWorkspaceId);

        if (!hasSelectedWorkspace) {
            setSelectedWorkspaceId(workspaces[0].id);
        }
    }, [workspaces, selectedWorkspaceId, setSelectedWorkspaceId, isFetching]);

    useEffect(() => {
        if (!hasHydratedRef.current || !userId || selectedWorkspaceId === null) {
            return;
        }

        if (lastPersistedWorkspaceIdRef.current === selectedWorkspaceId) {
            return;
        }

        const previousWorkspaceId = lastPersistedWorkspaceIdRef.current;
        lastPersistedWorkspaceIdRef.current = selectedWorkspaceId;

        userRepository.updateLatestWorkspace(userId, selectedWorkspaceId).catch((error) => {
            console.error("Failed to persist selected workspace:", error);
            lastPersistedWorkspaceIdRef.current = previousWorkspaceId;
        });
    }, [userId, selectedWorkspaceId]);
}
