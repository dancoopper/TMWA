import { useDashboardStore } from "@/stores/dashboardStore";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_SLOTS = [
    "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
    "12PM", "1PM", "2PM", "3PM", "4PM", "5PM",
    "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",
];

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

export default function CalendarWeekView() {
    const { selectedDate, setSelectedDate } = useDashboardStore();
    const weekDates = getWeekDates(selectedDate);
    const today = new Date();

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
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: '#e8e4d9' }}>
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-stone-300 shrink-0">
                <div className="w-14 border-r border-stone-300" /> {/* Time column spacer */}
                {weekDates.map((date, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className="py-2 text-center cursor-pointer transition-colors duration-200 hover:bg-stone-200/50 border-r border-stone-300 last:border-r-0"
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
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-8 h-full" style={{ minHeight: 'max-content' }}>
                    {/* Time labels column */}
                    <div className="w-14 border-r border-stone-300">
                        {TIME_SLOTS.map((time) => (
                            <div
                                key={time}
                                className="h-14 py-1 px-1 text-[10px] text-stone-500 text-right border-b border-stone-300/60"
                            >
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDates.map((date, dayIdx) => (
                        <div key={dayIdx} className="border-r border-stone-300 last:border-r-0">
                            {TIME_SLOTS.map((time) => (
                                <div
                                    key={`${dayIdx}-${time}`}
                                    className="h-14 border-b border-stone-300/60 hover:bg-stone-200/50 transition-colors duration-200 cursor-pointer"
                                    style={{
                                        backgroundColor: isToday(date) ? 'rgba(58, 58, 56, 0.05)' : '#cdc9bc'
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
