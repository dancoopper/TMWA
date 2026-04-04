import { useDashboardPostgresRealtime } from "../hooks/useDashboardPostgresRealtime";

/** Mount on the dashboard to sync shared workspace data over Realtime. */
export default function WorkspaceCollaborationSync() {
    useDashboardPostgresRealtime();
    return null;
}
