import { useEvents } from "@/features/event/hooks/useEvents";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useMemo } from "react";
import CalendarMonthCell from "./CalendarMonthCell";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function toDayKey(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export default function CalendarGrid() {
    const { selectedDate, setSelectedDate } = useDashboardStore();

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const today = new Date();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    // Calculate days from previous month to show
    const prevMonthDays = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        prevMonthDays.push(daysInPrevMonth - i);
    }

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Calculate days from next month to show (fill remaining cells to complete 6 rows)
    const totalCells = 42; // 6 rows * 7 days
    const nextMonthDays = totalCells - prevMonthDays.length - currentMonthDays.length;
    const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (_, i) => i + 1);
    const gridStartDate = new Date(year, month, 1 - firstDayOfMonth);
    const gridEndDate = new Date(year, month, daysInMonth + nextMonthDays);
    const { data: events = [] } = useEvents({ startDate: gridStartDate, endDate: gridEndDate });
    const eventsByDay = useMemo(() => {
        const grouped = new Map<string, string[]>();

        for (const event of events) {
            const dayKey = toDayKey(event.date);
            const dayEvents = grouped.get(dayKey) ?? [];
            dayEvents.push(event.title);
            grouped.set(dayKey, dayEvents);
        }

        return grouped;
    }, [events]);

    const getDayEventTitles = (date: Date) => eventsByDay.get(toDayKey(date)) ?? [];

    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );
    };

    const isToday = (day: number) => {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const handleDayClick = (day: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return;
        const newDate = new Date(year, month, day);
        setSelectedDate(newDate);
    };

    return (
        <div
            className="flex flex-col h-full overflow-hidden px-3 pb-3"
            style={{ backgroundColor: "#e7e2d4" }}
        >
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1.5 px-1 py-2 shrink-0">
                {DAYS_OF_WEEK.map((day) => (
                    <div
                        key={day}
                        className="px-2 text-xs font-medium text-stone-500"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6 gap-1.5 min-h-0">
                {prevMonthDays.map((day) => (
                    <CalendarMonthCell
                        key={`prev-${day}`}
                        day={day}
                        variant="previous"
                        eventTitles={getDayEventTitles(new Date(year, month - 1, day))}
                    />
                ))}

                {currentMonthDays.map((day) => {
                    const selected = isSelected(day);
                    const todayCell = isToday(day);

                    return (
                        <CalendarMonthCell
                            key={`current-${day}`}
                            day={day}
                            variant="current"
                            isSelected={selected}
                            isToday={todayCell}
                            eventTitles={getDayEventTitles(new Date(year, month, day))}
                            onClick={() => handleDayClick(day, true)}
                        />
                    );
                })}

                {nextMonthDaysArray.map((day) => (
                    <CalendarMonthCell
                        key={`next-${day}`}
                        day={day}
                        variant="next"
                        eventTitles={getDayEventTitles(new Date(year, month + 1, day))}
                    />
                ))}
            </div>
        </div>
    );
}
