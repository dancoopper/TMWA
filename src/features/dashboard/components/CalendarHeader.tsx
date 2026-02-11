import { useDashboardStore } from "@/stores/dashboardStore";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Users, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarHeader() {
    const {
        calendarView,
        setCalendarView,
        searchQuery,
        setSearchQuery,
        selectedDate,
        setSelectedDate,
        selectedWorkspaceId,
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

    const monthName = selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <div
            className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-stone-400/50 shrink-0"
            style={{ backgroundColor: '#d8d4c8' }}
        >
            {/* Workspace + Search */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0 max-w-md">
                <span className="px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-stone-300/50 rounded-md truncate">
                    {workspaceName}
                </span>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                    <Input
                        type="text"
                        placeholder="Search for specific tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 py-1.5 h-8 bg-white border-stone-300 rounded-md focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 transition-all duration-200 text-xs"
                    />
                </div>
            </div>

            {/* Navigation & View Toggle */}
            <div className="flex items-center gap-2">
                {/* Prev/Next Navigation */}
                <div className="flex items-center">
                    <button
                        onClick={goToPrev}
                        className="p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-4 h-4 text-stone-600" />
                    </button>
                    <span className="px-2 text-xs font-medium text-stone-700 min-w-[120px] text-center">
                        {monthName}
                    </span>
                    <button
                        onClick={goToNext}
                        className="p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                    >
                        <ChevronRight className="w-4 h-4 text-stone-600" />
                    </button>
                </div>

                {/* Month/Week Toggle */}
                <div className="flex bg-stone-400/40 rounded-md p-0.5">
                    <button
                        onClick={() => setCalendarView("month")}
                        className={`
                            px-3 py-1 text-[11px] font-semibold rounded transition-all duration-300
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
                            px-3 py-1 text-[11px] font-semibold rounded transition-all duration-300
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
                    className="gap-1.5 rounded-md bg-sky-500 hover:bg-sky-600 text-white transition-all duration-200 text-[11px] h-7 px-3"
                >
                    <Users className="w-3 h-3" />
                    Share
                </Button>

                {/* Add Event Button - Olive */}
                <Button
                    size="sm"
                    className="gap-1.5 rounded-md text-white transition-all duration-200 text-[11px] h-7 px-3"
                    style={{ backgroundColor: '#7c8c5c' }}
                >
                    <Plus className="w-3 h-3" />
                    Add Event
                </Button>
            </div>
        </div>
    );
}
