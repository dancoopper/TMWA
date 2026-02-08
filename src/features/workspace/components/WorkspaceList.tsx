"use client";

import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Edit, MoreVertical, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                <div
                    key={workspace.id}
                    className={`
                        w-full flex items-center justify-between px-2.5 py-2 rounded-md
                        text-stone-600 hover:bg-stone-600 hover:text-stone-100
                        cursor-pointer
                        transition-all duration-200 text-xs group
                        ${leftSidebarCollapsed ? "justify-center" : ""}
                    `}
                >
                    <button
                        className="flex items-center gap-2.5 flex-1 text-left min-w-0 cursor-pointer"
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="opacity-0 group-hover:opacity-100 p-0.5 
                                rounded transition-all cursor-pointer outline-none">
                                    <MoreVertical className="w-4 h-4 text-stone-100" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Handle edit
                                    }}
                                >
                                    <Edit className="w-3.5 h-3.5 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Handle delete
                                    }}
                                >
                                    <Trash className="w-3.5 h-3.5 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            ))}
        </div>
    );
}
