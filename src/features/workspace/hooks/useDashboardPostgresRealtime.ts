import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useWorkspaces } from "./useWorkspaces";

/**
 * Invalidates React Query caches when shared workspace data changes (invites, events, renames).
 * Uses Supabase Realtime postgres_changes; RLS ensures users only receive their workspaces.
 */
export function useDashboardPostgresRealtime() {
    const queryClient = useQueryClient();
    const session = useAuthStore((s) => s.session);
    const userId = session?.user.id;
    const { data: workspaces } = useWorkspaces();
    const idsKey = useMemo(
        () => [...(workspaces?.map((w) => w.id) ?? [])].sort((a, b) => a - b).join(","),
        [workspaces],
    );

    useEffect(() => {
        if (!userId || !idsKey) return;

        const workspaceIds = idsKey.split(",").map((x) => Number(x)).filter((n) => !Number.isNaN(n));
        if (workspaceIds.length === 0) return;

        const channel = supabase.channel(`dashboard-pg:${userId}`);

        for (const wsId of workspaceIds) {
            channel.on(
                "postgres_changes",
                { event: "*", schema: "public", table: "events", filter: `workspace_id=eq.${wsId}` },
                () => {
                    void queryClient.invalidateQueries({ queryKey: ["events"] });
                },
            );
            channel.on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "workspace_members",
                    filter: `workspace_id=eq.${wsId}`,
                },
                () => {
                    void queryClient.invalidateQueries({ queryKey: ["workspace-members"] });
                    void queryClient.invalidateQueries({ queryKey: ["workspace-members-bulk"] });
                },
            );
            channel.on(
                "postgres_changes",
                { event: "*", schema: "public", table: "workspaces", filter: `id=eq.${wsId}` },
                () => {
                    void queryClient.invalidateQueries({ queryKey: ["workspaces", userId] });
                },
            );
        }

        void channel.subscribe();

        return () => {
            void supabase.removeChannel(channel);
        };
    }, [userId, idsKey, queryClient]);
}
