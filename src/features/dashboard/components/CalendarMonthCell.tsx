type MonthCellEventItem = {
    id: number;
    title: string;
};

interface CalendarMonthCellProps {
    day: number;
    variant: "previous" | "current" | "next";
    isSelected?: boolean;
    isToday?: boolean;
    eventItems?: MonthCellEventItem[];
    onClick?: () => void;
    onDoubleClick?: () => void;
    onEventClick?: (eventId: number) => void;
}

export default function CalendarMonthCell({
    day,
    variant,
    isSelected = false,
    isToday = false,
    eventItems = [],
    onClick,
    onDoubleClick,
    onEventClick,
}: CalendarMonthCellProps) {
    const isCurrent = variant === "current";
    const visibleEvents = eventItems.slice(0, 2);
    const remainingEventCount = eventItems.length - visibleEvents.length;

    return (
        <div
            onClick={isCurrent ? onClick : undefined}
            onDoubleClick={isCurrent ? onDoubleClick : undefined}
            className={`
                rounded-2xl p-2.5 flex flex-col transition-all duration-200
                ${isCurrent
                    ? (isSelected
                        ? "cursor-pointer hover:brightness-95"
                        : (isToday
                            ? "cursor-pointer hover:shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.08)]"
                            : "cursor-pointer hover:shadow-[inset_0_0_0_9999px_rgba(87,83,78,0.16)]"))
                    : ""}
                ${isSelected ? "ring-2 ring-inset ring-sky-400/60" : ""}
                ${variant === "previous" ? "text-stone-300/20" : ""}
            `}
            style={{
                backgroundColor: isCurrent
                    ? (isToday ? "#1f2128" : "#dad6c8")
                    : (variant === "next" ? "#e2ded1" : undefined),
            }}
        >
            <span
                className={`
                    text-xs
                    ${isCurrent ? "font-semibold" : ""}
                    ${isCurrent
                        ? (isToday ? "text-stone-100" : (isSelected ? "text-stone-800" : "text-stone-500"))
                        : (variant === "next" ? "text-stone-400/80" : "text-stone-600")}
                `}
            >
                {day}
            </span>
            {eventItems.length > 0 ? (
                <div className="mt-1 space-y-1">
                    {visibleEvents.map((event) => (
                        <p
                            key={event.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEventClick?.(event.id);
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                            }}
                            className={`
                                text-[10px] leading-tight truncate flex items-center gap-1 cursor-pointer rounded-sm px-1 py-0.5 border border-transparent transition-colors duration-150
                                ${isCurrent
                                    ? (isToday
                                        ? "text-stone-200/90 hover:text-white hover:bg-stone-100/20 hover:border-stone-200/40"
                                        : "text-stone-700 hover:text-stone-900 hover:bg-stone-300/70 hover:border-stone-500/35")
                                    : (variant === "next"
                                        ? "text-stone-500/80 hover:text-stone-700 hover:bg-stone-300/55 hover:border-stone-500/30"
                                        : "text-stone-500 hover:text-stone-700 hover:bg-stone-300/55 hover:border-stone-500/30")}
                            `}
                            title={event.title}
                        >
                            <span className="text-[9px] leading-none">•</span>
                            <span className="truncate">{event.title}</span>
                        </p>
                    ))}
                    {remainingEventCount > 0 ? (
                        <span
                            className={`
                                inline-block text-[10px] leading-none
                                ${isCurrent
                                    ? (isToday ? "text-stone-200/90" : "text-stone-600")
                                    : "text-stone-500"}
                            `}
                        >
                            +{remainingEventCount}
                        </span>
                    ) : null}
                </div>
            ) : (isCurrent ? <div className="flex-1" /> : null)}
        </div>
    );
}