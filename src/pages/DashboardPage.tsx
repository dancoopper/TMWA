import {
    CalendarGrid,
    CalendarHeader,
    CalendarWeekView,
    DayDetailPanel,
    Sidebar,
    TasksMainPanel,
} from "@/features/dashboard/components";
import WorkspaceCollaborationSync from "@/features/workspace/components/WorkspaceCollaborationSync";
import CreateEventDialog from "@/features/event/components/CreateEventDialog";
import { useDashboardStore } from "@/stores/dashboardStore";

export default function DashboardPage() {
    const {
        mainView,
        calendarView,
        createEventDialogOpen,
        createEventInitialStart,
        createEventInitialEnd,
        closeCreateEventDialog,
    } = useDashboardStore();

    return (
        <div
            className="flex h-screen w-full overflow-hidden"
            style={{ backgroundColor: "#e7e2d4" }}
        >
            <WorkspaceCollaborationSync />
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <CalendarHeader />

                {mainView === "calendar"
                    ? (
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
                    )
                    : (
                        <TasksMainPanel />
                    )}
            </main>

            {/* Right Day Detail Panel */}
            <DayDetailPanel />
            <CreateEventDialog
                open={createEventDialogOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        closeCreateEventDialog();
                    }
                }}
                initialStart={createEventInitialStart ?? undefined}
                initialEnd={createEventInitialEnd ?? undefined}
            />
        </div>
    );
}
