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
        <div className="flex flex-col h-full overflow-hidden px-3 pb-3" style={{ backgroundColor: "#e7e2d4" }}>
            {/* Days Header */}
            <div className="grid grid-cols-8 shrink-0 gap-1.5 px-1 py-2">
                <div className="w-14" /> {/* Time column spacer */}
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
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-8 h-full gap-1.5" style={{ minHeight: "max-content" }}>
                    {/* Time labels column */}
                    <div className="w-14">
                        {TIME_SLOTS.map((time) => (
                            <div
                                key={time}
                                className="h-14 py-1 px-1 text-[10px] text-stone-500 text-right"
                            >
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {weekDates.map((date, dayIdx) => (
                        <div key={dayIdx} className="rounded-2xl overflow-hidden">
                            {TIME_SLOTS.map((time) => (
                                <div
                                    key={`${dayIdx}-${time}`}
                                    className="h-14 border-b border-stone-300/40 hover:bg-stone-200/50 transition-colors duration-200 cursor-pointer"
                                    style={{
                                        backgroundColor: isToday(date) ? "rgba(31, 33, 40, 0.14)" : "#dad6c8",
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
