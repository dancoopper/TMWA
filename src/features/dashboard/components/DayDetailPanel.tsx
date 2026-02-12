import { useEvents } from "@/features/event/hooks/useEvents";
import type { Event } from "@/features/event/models/Event";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useMemo } from "react";
import { PanelRightClose, PanelRight } from "lucide-react";

const TIME_SLOTS = [
    "12AM", "1AM", "2AM", "3AM", "4AM", "5AM",
    "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
    "12PM", "1PM", "2PM", "3PM", "4PM", "5PM",
    "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",
];

function getEventDataPreview(data: Event["data"]) {
    if (!Array.isArray(data)) return "No details";
    if (data.length === 0) return "No details";

    const firstItem = data[0];
    if (firstItem && typeof firstItem === "object" && !Array.isArray(firstItem)) {
        const entries = Object.entries(firstItem as Record<string, unknown>);
        if (entries.length > 0) {
            const [key, value] = entries[0];
            return `${key}: ${String(value)}`;
        }
    }

    return `${data.length} item${data.length > 1 ? "s" : ""}`;
}

export default function DayDetailPanel() {
    const { rightPanelCollapsed, toggleRightPanel, selectedDate } = useDashboardStore();
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);
    const { data: events = [] } = useEvents({ startDate: dayStart, endDate: dayEnd });
    const eventsByHour = useMemo(() => {
        const grouped = new Map<number, Event[]>();

        for (const event of events) {
            const hour = event.date.getHours();
            const slotEvents = grouped.get(hour) ?? [];
            slotEvents.push(event);
            grouped.set(hour, slotEvents);
        }

        return grouped;
    }, [events]);

    const getSlotEvents = (timeSlot: string) => {
        const parsedHour = Number.parseInt(timeSlot, 10);
        const isPm = timeSlot.endsWith("PM");
        const isAm = timeSlot.endsWith("AM");
        if (!isPm && !isAm) return [];

        let hour24 = parsedHour % 12;
        if (isPm) hour24 += 12;

        return eventsByHour.get(hour24) ?? [];
    };

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
                    {TIME_SLOTS.map((time) => {
                        const slotEvents = getSlotEvents(time);

                        return (
                            <div
                                key={time}
                                className="flex border-b border-stone-300/60 min-h-[40px] hover:bg-stone-300/30 transition-colors duration-200"
                            >
                                <div className="w-12 shrink-0 py-2 px-2 text-[10px] text-stone-500 text-right">
                                    {time}
                                </div>
                                <div className="flex-1 border-l border-stone-300/60 px-2 py-1.5 cursor-pointer">
                                    {slotEvents.slice(0, 2).map((event) => (
                                        <div
                                            key={event.id}
                                            className="rounded-md border border-stone-400/30 bg-stone-100/70 px-1.5 py-1 mb-1 last:mb-0"
                                            title={event.title}
                                        >
                                            <p className="text-[10px] leading-tight truncate text-stone-800 font-medium">
                                                {event.title}
                                            </p>
                                            <p className="text-[9px] leading-tight truncate text-stone-600">
                                                {getEventDataPreview(event.data)}
                                            </p>
                                        </div>
                                    ))}
                                    {slotEvents.length > 2 ? (
                                        <p className="text-[10px] leading-tight text-stone-500">
                                            +{slotEvents.length - 2}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
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
