import { useDashboardStore } from "@/stores/dashboardStore";
import TasksListView from "./TasksListView";
import TasksBoardView from "./TasksBoardView";

export default function TasksMainPanel() {
    const tasksViewMode = useDashboardStore((s) => s.tasksViewMode);

    return (
        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
            {tasksViewMode === "board" ? <TasksBoardView /> : <TasksListView />}
        </div>
    );
}
