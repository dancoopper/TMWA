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

    const isToday = (day: number) => {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );
    };

    const handleDayClick = (day: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return;
        const newDate = new Date(year, month, day);
        setSelectedDate(newDate);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#e8e4d9' }}>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-stone-300 shrink-0">
                {DAYS_OF_WEEK.map((day) => (
                    <div
                        key={day}
                        className="py-2 text-center text-xs font-medium text-stone-600 border-r border-stone-300 last:border-r-0"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid - Fills remaining space */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6">
                {/* Previous Month Days */}
                {prevMonthDays.map((day) => (
                    <div
                        key={`prev-${day}`}
                        className="border-b border-r border-stone-300/60 p-2 flex flex-col"
                        style={{ backgroundColor: '#d4d0c5' }}
                    >
                        <span className="text-xs text-stone-400">{day}</span>
                    </div>
                ))}

                {/* Current Month Days */}
                {currentMonthDays.map((day) => (
                    <div
                        key={`current-${day}`}
                        onClick={() => handleDayClick(day, true)}
                        className={`
                            border-b border-r border-stone-300/60 p-2 cursor-pointer flex flex-col
                            transition-all duration-200 hover:brightness-95
                            ${isSelected(day) && !isToday(day) ? "ring-2 ring-inset ring-sky-400" : ""}
                        `}
                        style={{
                            backgroundColor: isToday(day) ? '#3a3a38' : '#cdc9bc'
                        }}
                    >
                        <span className={`
                            inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full shrink-0
                            ${isToday(day)
                                ? "text-white"
                                : isSelected(day)
                                    ? "bg-sky-500 text-white"
                                    : "text-stone-700"
                            }
                        `}>
                            {day}
                        </span>
                        {/* Event space - fills remaining cell height */}
                        <div className="flex-1 mt-1"></div>
                    </div>
                ))}

                {/* Next Month Days */}
                {nextMonthDaysArray.map((day) => (
                    <div
                        key={`next-${day}`}
                        className="border-b border-r border-stone-300/60 p-2 flex flex-col"
                        style={{ backgroundColor: '#d4d0c5' }}
                    >
                        <span className="text-xs text-stone-400">{day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
