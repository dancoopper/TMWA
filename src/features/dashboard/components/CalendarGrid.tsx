import { useDashboardStore } from "@/stores/dashboardStore";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
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
                    <div
                        key={`prev-${day}`}
                        className="rounded-2xl p-2.5 flex flex-col text-stone-300/20"
                    >
                        <span className="text-xs text-stone-600">{day}</span>
                    </div>
                ))}

                {currentMonthDays.map((day) => {
                    const selected = isSelected(day);
                    const todayCell = isToday(day);

                    return (
                        <div
                            key={`current-${day}`}
                            onClick={() => handleDayClick(day, true)}
                            className={`
                                rounded-2xl p-2.5 cursor-pointer flex flex-col transition-all duration-200 hover:brightness-95
                                ${selected ? "ring-2 ring-inset ring-sky-400/60" : ""}
                            `}
                            style={{
                                backgroundColor: todayCell ? "#1f2128" : "#dad6c8",
                            }}
                        >
                            <span
                                className={`
                                    text-xs font-semibold
                                    ${todayCell ? "text-stone-100" : selected ? "text-stone-800" : "text-stone-500"}
                                `}
                            >
                                {day}
                            </span>
                            <div className="flex-1" />
                        </div>
                    );
                })}

                {nextMonthDaysArray.map((day) => (
                    <div
                        key={`next-${day}`}
                        className="rounded-2xl p-2.5 flex flex-col"
                        style={{ backgroundColor: "#e2ded1" }}
                    >
                        <span className="text-xs text-stone-400/80">{day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
