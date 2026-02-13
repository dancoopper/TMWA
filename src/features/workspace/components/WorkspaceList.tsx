import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { EllipsisVertical, Pen, Trash } from "lucide-react";
import EditWorkspaceDialog from "./EditWorkspaceDialog";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover";
import DeleteWorkspaceDialog from "./DeleteWorkspaceDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardStore } from "@/stores/dashboardStore";

export default function WorkspaceList() {
    const { data: workspaces, isLoading } = useWorkspaces();
    const { selectedWorkspaceId, setSelectedWorkspaceId } = useDashboardStore();

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
                        transition-all duration-200 text-xs group
                        ${selectedWorkspaceId === workspace.id
                            ? "bg-stone-400/60 text-stone-800"
                            : "text-stone-600 hover:bg-stone-600 hover:text-stone-100"}
                    `}
                >
                    <button
                        className="flex items-center gap-2.5 flex-1 text-left min-w-0"
                        onClick={() => setSelectedWorkspaceId(workspace.id)}
                    >
                        <div
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedWorkspaceId === workspace.id ? "bg-stone-700" : "bg-stone-500"}`}
                        />
                        <span className="truncate">{workspace.name}</span>
                    </button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="opacity-0 group-hover:opacity-100 p-1 
                            rounded transition-all outline-none
                            hover:bg-stone-300/20 text-stone-400 hover:text-stone-600"
                            >
                                <EllipsisVertical className="w-3.5 h-3.5" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 flex flex-col pt-1 items-start border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                            <PopoverHeader>
                                <PopoverTitle className="text-stone-600 text-xs p-2">
                                    Workspace
                                </PopoverTitle>
                            </PopoverHeader>
                            <Separator className="my-1"/>
                            <EditWorkspaceDialog
                                workspace={workspace}
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-stone-700 hover:bg-stone-300/60 hover:text-stone-800" 
                                    >
                                        <Pen className="w-3.5 h-3.5 mr-1" />
                                        Edit
                                    </Button>
                                }
                            />
                            <DeleteWorkspaceDialog
                                workspace={workspace}
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-stone-700 hover:bg-rose-500/20 hover:text-rose-700"
                                    >
                                        <Trash className="w-3.5 h-3.5 mr-1" />
                                        Delete
                                    </Button>
                                }
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            ))}
        </div>
    );
}
