"use client";

import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { useDashboardStore } from "@/stores/dashboardStore";

export default function WorkspaceList() {
    const { data: workspaces, isLoading } = useWorkspaces();
    const { leftSidebarCollapsed } = useDashboardStore();

    if (isLoading) {
        return (
            <div className="px-2.5 py-2">
                <div className="h-4 w-24 bg-stone-200 animate-pulse rounded" />
            </div>
        );
    }

    if (!workspaces?.length) {
        return null;
    }

    return (
        <div className="flex flex-col gap-0.5">
            {workspaces.map((workspace) => (
                <button
                    key={workspace.id}
                    className={`
                        w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md
                        text-stone-600 hover:text-stone-800 hover:bg-stone-300/50
                        transition-all duration-200 text-xs
                        ${leftSidebarCollapsed ? "justify-center" : ""}
                    `}
                >
                    <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 bg-stone-500`}
                    />
                    {!leftSidebarCollapsed && (
                        <span className="truncate">{workspace.name}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
