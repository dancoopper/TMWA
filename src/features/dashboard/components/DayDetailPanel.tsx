import { useDashboardStore } from "@/stores/dashboardStore";
import { PanelRightClose, PanelRight } from "lucide-react";

const TIME_SLOTS = [
    "12AM", "1AM", "2AM", "3AM", "4AM", "5AM",
    "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
    "12PM", "1PM", "2PM", "3PM", "4PM", "5PM",
    "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",
];

export default function DayDetailPanel() {
    const { rightPanelCollapsed, toggleRightPanel, selectedDate } = useDashboardStore();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <aside
            className={`
                flex flex-col h-full border-l border-stone-400/40
                transition-all duration-500 ease-out overflow-hidden
                ${rightPanelCollapsed ? "w-10" : "w-64"}
            `}
            style={{ backgroundColor: "#dfdacb" }}
        >
            {/* Header with Toggle */}
            <div className="p-2 border-b border-stone-400/40 shrink-0">
                {rightPanelCollapsed ? (
                    <button
                        onClick={toggleRightPanel}
                        className="mx-auto mt-1 block p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                    >
                        <PanelRight className="w-4 h-4 text-stone-500" />
                    </button>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-stone-800">
                                {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
                            </h2>
                            <p className="text-stone-500 text-xs">
                                {formatDate(selectedDate)}
                            </p>
                        </div>
                        <button
                            onClick={toggleRightPanel}
                            className="p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                        >
                            <PanelRightClose className="w-4 h-4 text-stone-500" />
                        </button>
                    </div>
                )}
            </div>

            {/* Time Slots - Only show when expanded */}
            {!rightPanelCollapsed && (
                <div className="flex-1 overflow-y-auto">
                    {TIME_SLOTS.map((time) => (
                        <div
                            key={time}
                            className="flex border-b border-stone-300/60 min-h-[40px] hover:bg-stone-300/30 transition-colors duration-200"
                        >
                            <div className="w-12 shrink-0 py-2 px-2 text-[10px] text-stone-500 text-right">
                                {time}
                            </div>
                            <div className="flex-1 border-l border-stone-300/60 cursor-pointer" />
                        </div>
                    ))}
                </div>
            )}

            {rightPanelCollapsed && (
                <div className="mt-auto p-2 border-t border-stone-400/40">
                    <button
                        onClick={toggleRightPanel}
                        className="mx-auto block p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                    >
                        <PanelRight className="w-4 h-4 text-stone-500" />
                    </button>
                </div>
            )}
        </aside>
    );
}
