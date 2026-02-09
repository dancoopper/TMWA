import {
    CalendarGrid,
    CalendarHeader,
    CalendarWeekView,
    DayDetailPanel,
    Sidebar,
} from "@/features/dashboard/components";
import { useDashboardStore } from "@/stores/dashboardStore";

export default function DashboardPage() {
    const { calendarView } = useDashboardStore();

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ backgroundColor: "#e8e4d9" }}
        >
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <CalendarHeader />

                {/* Calendar Views with Animation */}
                <div className="flex-1 relative overflow-hidden">
                    <div
                        className={`
                            absolute inset-0 transition-all duration-500 ease-out
                            ${
                            calendarView === "month"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-full pointer-events-none"
                        }
                        `}
                    >
                        <CalendarGrid />
                    </div>
                    <div
                        className={`
                            absolute inset-0 transition-all duration-500 ease-out
                            ${
                            calendarView === "week"
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-full pointer-events-none"
                        }
                        `}
                    >
                        <CalendarWeekView />
                    </div>
                </div>
            </main>

            {/* Right Day Detail Panel */}
            <DayDetailPanel />
        </div>
    );
}
