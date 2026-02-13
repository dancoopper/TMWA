import { useDashboardStore } from "@/stores/dashboardStore";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Plus, Users } from "lucide-react";

export default function CalendarHeader() {
    const {
        calendarView,
        setCalendarView,
        searchQuery,
        setSearchQuery,
        selectedDate,
        setSelectedDate,
        selectedWorkspaceId,
        openCreateEventDialog,
    } = useDashboardStore();
    const { data: workspaces } = useWorkspaces();
    const selectedWorkspace = workspaces?.find((workspace) => workspace.id === selectedWorkspaceId);
    const workspaceName = selectedWorkspace?.name ?? workspaces?.[0]?.name ?? "Workspace";

    const goToPrev = () => {
        const newDate = new Date(selectedDate);
        if (calendarView === "month") {
            newDate.setMonth(selectedDate.getMonth() - 1);
        } else {
            newDate.setDate(selectedDate.getDate() - 7);
        }
        setSelectedDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(selectedDate);
        if (calendarView === "month") {
            newDate.setMonth(selectedDate.getMonth() + 1);
        } else {
            newDate.setDate(selectedDate.getDate() + 7);
        }
        setSelectedDate(newDate);
    };
    const monthName = selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div
            className="flex h-12 items-center justify-between gap-3 px-3 border-b border-stone-400/40 shrink-0"
            style={{ backgroundColor: "#dfdacb" }}
        >
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-0 max-w-lg">
                <span className="px-2 py-0.5 text-[10px] font-semibold text-stone-700 bg-stone-300/40 rounded-full truncate shrink-0">
                    {workspaceName}
                </span>
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400" />
                    <Input
                        type="text"
                        placeholder="Search for specific tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 py-1 h-7 bg-[#e8e4d9] border-stone-300/60 rounded-full shadow-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all duration-200 text-[11px] placeholder:text-stone-500"
                    />
                </div>
            </div>

            {/* Navigation & View Toggle */}
            <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 mr-1">
                    <button
                        onClick={goToPrev}
                        className="p-1 rounded-md hover:bg-stone-300/50 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-4 h-4 text-stone-600" />
                    </button>
                    <span className="hidden md:block text-[11px] font-medium text-stone-600 min-w-[88px] text-center">
                        {monthName}
                    </span>
                    <button
                        onClick={goToNext}
                        className="p-1 rounded-md hover:bg-stone-300/50 transition-colors duration-200"
                    >
                        <ChevronRight className="w-4 h-4 text-stone-600" />
                    </button>
                </div>
                {/* Month/Week Toggle */}
                <div className="flex bg-stone-400/30 rounded-full p-0.5">
                    <button
                        onClick={() => setCalendarView("month")}
                        className={`
                            px-2.5 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-300
                            ${calendarView === "month"
                                ? "bg-stone-700 text-white shadow-sm"
                                : "text-stone-600 hover:text-stone-800"
                            }
                        `}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setCalendarView("week")}
                        className={`
                            px-2.5 py-0.5 text-[10px] font-semibold rounded-full transition-all duration-300
                            ${calendarView === "week"
                                ? "bg-stone-700 text-white shadow-sm"
                                : "text-stone-600 hover:text-stone-800"
                            }
                        `}
                    >
                        Week
                    </button>
                </div>

                {/* Share Button - Blue background */}
                <Button
                    size="sm"
                    className="gap-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 text-[10px] h-6 px-2.5"
                >
                    <Users className="w-3 h-3" />
                    Share
                </Button>

                {/* Add Event Button - Olive */}
                <Button
                    size="sm"
                    className="gap-1.5 rounded-full text-white transition-all duration-200 text-[10px] h-6 px-2.5"
                    style={{ backgroundColor: "#8d9b67" }}
                    onClick={() => openCreateEventDialog(selectedDate)}
                >
                    <Plus className="w-3 h-3" />
                    Add Event
                </Button>
            </div>
        </div>
    );
}
