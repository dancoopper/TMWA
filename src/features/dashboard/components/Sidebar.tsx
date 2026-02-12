import { useDashboardStore } from "@/stores/dashboardStore";
import {
    Calendar,
    CheckSquare,
    PanelLeft,
    PanelLeftClose,
    Plus,
    Settings,
    UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import CreateWorkspaceDialog from "@/features/workspace/components/CreateWorkspaceDialog";
import WorkspaceList from "@/features/workspace/components/WorkspaceList";
import { useWorkspaceSelectionSync } from "@/features/workspace/hooks/useWorkspaceSelectionSync";

const views = [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
];

export default function Sidebar() {
    const { leftSidebarCollapsed, toggleLeftSidebar } = useDashboardStore();
    useWorkspaceSelectionSync();
    const navigate = useNavigate();

    return (
        <aside
            className={`
                flex flex-col h-full border-r border-stone-400/40
                transition-all duration-500 ease-out
                ${leftSidebarCollapsed ? "w-12" : "w-56"}
            `}
            style={{ backgroundColor: "#dfdacb" }}
        >
            {/* Logo & Toggle */}
            <div className="flex items-center justify-between p-3 border-b border-stone-400/40">
                {!leftSidebarCollapsed
                    ? (
                        <span className="font-bold text-base text-stone-700">
                            TMWA
                        </span>
                    )
                    : (
                        <span className="font-bold text-[9px] leading-3 text-stone-600 mx-auto text-center">
                            TM
                            <br />
                            WA
                        </span>
                    )}

                {/* Toggle Button - Integrated in header */}
                {!leftSidebarCollapsed && (
                    <button
                        onClick={toggleLeftSidebar}
                        className="p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                    >
                        <PanelLeftClose className="w-4 h-4 text-stone-500" />
                    </button>
                )}
            </div>

            {/* Collapsed state toggle */}
            {leftSidebarCollapsed && (
                <button
                    onClick={toggleLeftSidebar}
                    className="mx-auto mt-2 p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                >
                    <PanelLeft className="w-4 h-4 text-stone-500" />
                </button>
            )}

            {/* Views Section */}
            <div className="flex-1 overflow-y-auto p-2">
                <div className="mb-4">
                    {!leftSidebarCollapsed && (
                        <h3 className="px-2 py-1.5 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                            Views
                        </h3>
                    )}
                    <nav className="space-y-0.5">
                        {views.map((view, idx) => (
                            <button
                                key={view.id}
                                className={`
                                    w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md
                                    text-stone-600 hover:text-stone-800 hover:bg-stone-300/50
                                    transition-all duration-200 text-xs
                                    ${
                                    leftSidebarCollapsed ? "justify-center" : ""
                                }
                                    ${
                                    idx === 0
                                        ? "bg-stone-300/40 text-stone-800"
                                        : ""
                                }
                                `}
                            >
                                <view.icon className="w-3.5 h-3.5 shrink-0" />
                                {!leftSidebarCollapsed && (
                                    <span>{view.label}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Workspaces Section */}
                {!leftSidebarCollapsed && (
                    <div>
                        <div className="flex flex-row justify-between">
                            <h3 className="px-2 py-1.5 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                                Workspaces
                            </h3>
                            <CreateWorkspaceDialog
                                trigger={
                                    <button className="p-1.5 rounded-md 
                                    text-stone-500 hover:bg-stone-500 hover:text-white 
                                    active:translate-y-0.5 transition-all duration-200 cursor-pointer">
                                        <Plus className="w-3.5 h-3.5 shrink-0" />
                                    </button>
                                }
                            />
                        </div>

                        <WorkspaceList />
                    </div>
                )}
            </div>

            {/* Settings Button */}
            <div className="p-2 border-t border-stone-400/40">
                {leftSidebarCollapsed ? (
                    <button
                        onClick={() => navigate(ROUTES.SETTINGS)}
                        className="w-full flex justify-center text-stone-500 hover:text-stone-700 transition-colors duration-200"
                    >
                        <UserCircle2 className="w-5 h-5 shrink-0" />
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(ROUTES.SETTINGS)}
                        className={`
                            w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md
                            text-stone-500 hover:text-stone-700 hover:bg-stone-300/50
                            transition-all duration-200 text-xs
                            ${leftSidebarCollapsed ? "justify-center" : ""}
                        `}
                    >
                        <Settings className="w-3.5 h-3.5 shrink-0" />
                        {!leftSidebarCollapsed && <span>Settings</span>}
                    </button>
                )}
            </div>
        </aside>
    );
}
