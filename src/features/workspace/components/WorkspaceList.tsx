"use client";

import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Pen } from "lucide-react";
import { useWorkspaceStore } from "@/stores/workspaceStore";

export default function WorkspaceList() {
    const { data: workspaces, isLoading } = useWorkspaces();
    const { leftSidebarCollapsed } = useDashboardStore();
    const { openSettings } = useWorkspaceStore();

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
                <div
                    key={workspace.id}
                    className={`
                        w-full flex items-center justify-between px-2.5 py-2 rounded-md
                        text-stone-600 hover:bg-stone-600 hover:text-stone-100
                        transition-all duration-200 text-xs group
                        ${leftSidebarCollapsed ? "justify-center" : ""}
                    `}
                >
                    <button
                        className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                        onClick={() => {
                            // TODO: Handle workspace selection
                        }}
                    >
                        <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 bg-stone-500`}
                        />
                        {!leftSidebarCollapsed && (
                            <span className="truncate">{workspace.name}</span>
                        )}
                    </button>

                    {!leftSidebarCollapsed && (
                        <button
                            className="opacity-0 group-hover:opacity-100 p-1 
                            rounded transition-all outline-none
                            hover:bg-stone-300/20 text-stone-200 hover:text-stone-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                openSettings(workspace);
                            }}
                            title="Workspace Settings"
                        >
                            <Pen className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
