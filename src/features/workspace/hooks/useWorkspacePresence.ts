import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export type WorkspacePresencePeer = {
    userId: string;
    name: string;
    email: string;
};

/**
 * Who else is currently viewing this workspace (Supabase Realtime Presence).
 */
export function useWorkspacePresence(workspaceId: number | null) {
    const session = useAuthStore((s) => s.session);
    const userProfile = useAuthStore((s) => s.userProfile);

    const displayName = [userProfile?.firstName, userProfile?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() || session?.user.email?.split("@")[0] || "You";

    const [others, setOthers] = useState<WorkspacePresencePeer[]>([]);

    useEffect(() => {
        if (workspaceId == null || !session?.user.id) {
            setOthers([]);
            return;
        }

        const userId = session.user.id;
        const email = session.user.email ?? "";
        const trackPayload = {
            user_id: userId,
            name: displayName,
            email,
        };

        const channel = supabase.channel(`workspace:${workspaceId}:viewers`, {
            config: { presence: { key: userId } },
        });

        const syncPeers = () => {
            const state = channel.presenceState();
            const list: WorkspacePresencePeer[] = [];
            for (const presences of Object.values(state)) {
                for (const raw of presences as unknown[]) {
                    if (!raw || typeof raw !== "object") continue;
                    const p = raw as Record<string, unknown>;
                    const uid = typeof p.user_id === "string" ? p.user_id : "";
                    if (!uid || uid === userId) continue;
                    const name = typeof p.name === "string" ? p.name : "";
                    const em = typeof p.email === "string" ? p.email : "";
                    list.push({
                        userId: uid,
                        name: name || em.split("@")[0] || "Member",
                        email: em,
                    });
                }
            }
            const byId = new Map<string, WorkspacePresencePeer>();
            for (const p of list) {
                if (!byId.has(p.userId)) byId.set(p.userId, p);
            }
            setOthers([...byId.values()]);
        };

        channel.on("presence", { event: "sync" }, syncPeers);
        channel.on("presence", { event: "join" }, syncPeers);
        channel.on("presence", { event: "leave" }, syncPeers);

        void channel.subscribe(async (status) => {
            if (status !== "SUBSCRIBED") return;
            const sent = await channel.track(trackPayload);
            if (sent !== "ok") {
                console.warn("presence track failed:", sent);
                return;
            }
            syncPeers();
        });

        return () => {
            void supabase.removeChannel(channel);
            setOthers([]);
        };
    }, [workspaceId, session?.user.id, session?.user.email, displayName]);

    return { others, selfLabel: displayName };
}
