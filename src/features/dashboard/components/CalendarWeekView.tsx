import { useEvents } from "@/features/event/hooks/useEvents";
import type { Event } from "@/features/event/models/Event";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useMemo } from "react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DEFAULT_START_HOUR = 5;
const END_HOUR = 23;

function getWeekDates(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const weekStart = new Date(date);
    weekStart.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });
}

function toDayKey(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

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

function formatHourLabel(hour24: number) {
    const suffix = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;
    return `${hour12}${suffix}`;
}

function formatCurrentTimeLabel(date: Date) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}

export default function CalendarWeekView() {
    const { selectedDate, setSelectedDate, selectEvent } = useDashboardStore();
    const weekDates = getWeekDates(selectedDate);
    const weekStart = new Date(weekDates[0]);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekDates[6]);
    weekEnd.setHours(23, 59, 59, 999);
    const today = new Date();
    const { data: events = [] } = useEvents({ startDate: weekStart, endDate: weekEnd });
    const startHour = useMemo(() => {
        if (events.length === 0) return DEFAULT_START_HOUR;

        const earliestHour = Math.min(...events.map((event) => event.date.getHours()));
        return earliestHour < DEFAULT_START_HOUR ? earliestHour : DEFAULT_START_HOUR;
    }, [events]);

    const timeSlots = useMemo(
        () => Array.from({ length: END_HOUR - startHour + 1 }, (_, i) => startHour + i),
        [startHour]
    );
    const rowTemplate = useMemo(
        () => `repeat(${timeSlots.length}, minmax(3rem, 1fr))`,
        [timeSlots.length]
    );

    const eventsByDayAndHour = useMemo(() => {
        const grouped = new Map<string, Map<number, Event[]>>();

        for (const event of events) {
            const dayKey = toDayKey(event.date);
            const hour = event.date.getHours();
            const dayMap = grouped.get(dayKey) ?? new Map<number, Event[]>();
            const hourEvents = dayMap.get(hour) ?? [];
            hourEvents.push(event);
            dayMap.set(hour, hourEvents);
            grouped.set(dayKey, dayMap);
        }

        return grouped;
    }, [events]);

    const getSlotEvents = (date: Date, hour: number) => {
        const dayMap = eventsByDayAndHour.get(toDayKey(date));
        if (!dayMap) return [];
        return dayMap.get(hour) ?? [];
    };
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeLabel = formatCurrentTimeLabel(today);
    const todayInWeek = weekDates.some((date) => isSameDay(date, today));
    const showCurrentTimeLine = todayInWeek && currentHour >= startHour && currentHour <= END_HOUR;
    const currentTimeOffsetPercent = ((currentHour + currentMinute / 60 - startHour) / timeSlots.length) * 100;

    const isToday = (date: Date) => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSelected = (date: Date) => {
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        );
    };

    return (
        <div className="flex flex-col h-full overflow-hidden px-3 pb-3" style={{ backgroundColor: "#e7e2d4" }}>
            {/* Days Header */}
            <div
                className="grid shrink-0 gap-1 px-1 py-2"
                style={{ gridTemplateColumns: "auto repeat(7, minmax(0, 1fr))" }}
            >
                <div className="w-8" /> {/* Time column spacer */}
                {weekDates.map((date, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className="py-1.5 text-center cursor-pointer transition-colors duration-200 rounded-xl hover:bg-stone-200/50"
                    >
                        <div className="text-[10px] font-medium text-stone-500 mb-0.5">
                            {DAYS_OF_WEEK[idx]}
                        </div>
                        <div className={`
                            inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold
                            ${isToday(date)
                                ? "text-white"
                                : isSelected(date)
                                    ? "bg-sky-500 text-white"
                                    : "text-stone-700"
                            }
                        `}
                            style={isToday(date) ? { backgroundColor: '#3a3a38' } : {}}
                        >
                            {date.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time Grid - Fills all available space */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(120,113,108,0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-stone-500/45">
                <div
                    className="relative grid h-full gap-1"
                    style={{
                        minHeight: "max-content",
                        gridTemplateColumns: "auto repeat(7, minmax(0, 1fr))",
                    }}
                >
                    {showCurrentTimeLine ? (
                        <div
                            className="pointer-events-none absolute left-0 right-0 z-30"
                            style={{ top: `${currentTimeOffsetPercent}%` }}
                        >
                            <div className="absolute left-0 -translate-y-1/2 rounded-sm bg-rose-600 px-1 py-0.5 text-[9px] font-semibold leading-none text-white">
                                {currentTimeLabel}
                            </div>
                            <div className="border-t border-rose-500/85" />
                        </div>
                    ) : null}

                    {/* Time labels column */}
                    <div
                        className="grid"
                        style={{ gridTemplateRows: rowTemplate }}
                    >
                        {timeSlots.map((hour) => (
                            <div
                                key={hour}
                                className="py-1 pr-0.5 text-[10px] text-stone-500 text-right"
                            >
                                {formatHourLabel(hour)}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDates.map((date, dayIdx) => (
                        <div
                            key={dayIdx}
                            className="rounded-2xl overflow-hidden grid"
                            style={{ gridTemplateRows: rowTemplate }}
                        >
                            {timeSlots.map((hour) => {
                                const slotEvents = getSlotEvents(date, hour);

                                return (
                                    <div
                                        key={`${dayIdx}-${hour}`}
                                        className="border-b border-stone-300/40 hover:bg-stone-200/50 transition-colors duration-200 cursor-pointer p-1"
                                        style={{
                                            backgroundColor: isToday(date) ? "rgba(31, 33, 40, 0.14)" : "#dad6c8",
                                        }}
                                    >
                                        {slotEvents.slice(0, 1).map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    selectEvent(event);
                                                }}
                                                className="rounded-sm border border-stone-500/20 bg-stone-200/55 px-1.5 py-1 cursor-pointer transition-all duration-150 hover:bg-stone-300/80 hover:border-stone-600/45 hover:shadow-[inset_0_0_0_1px_rgba(87,83,78,0.35)] hover:-translate-y-px"
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
                                        {slotEvents.length > 1 ? (
                                            <p className="text-[10px] leading-tight text-stone-500">
                                                +{slotEvents.length - 1}
                                            </p>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
