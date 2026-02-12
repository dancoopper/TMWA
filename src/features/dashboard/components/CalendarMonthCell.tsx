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
    onEventClick?: (eventId: number) => void;
}

export default function CalendarMonthCell({
    day,
    variant,
    isSelected = false,
    isToday = false,
    eventItems = [],
    onClick,
    onEventClick,
}: CalendarMonthCellProps) {
    const isCurrent = variant === "current";
    const visibleEvents = eventItems.slice(0, 2);
    const remainingEventCount = eventItems.length - visibleEvents.length;

    return (
        <div
            onClick={isCurrent ? onClick : undefined}
            className={`
                rounded-2xl p-2.5 flex flex-col transition-all duration-200
                ${isCurrent ? "cursor-pointer hover:brightness-95" : ""}
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
                            className={`
                                text-[10px] leading-tight truncate flex items-center gap-1 cursor-pointer
                                ${isCurrent
                                    ? (isToday ? "text-stone-200/90" : "text-stone-700")
                                    : (variant === "next"
                                        ? "text-stone-500/80"
                                        : "text-stone-500")}
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