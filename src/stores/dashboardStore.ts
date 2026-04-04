import { create } from "zustand";
import type { Event } from "@/features/event/models/Event";

type CalendarView = "month" | "week";

export type MainView = "calendar" | "tasks";

export type TasksViewMode = "list" | "board";

type DashboardState = {
    leftSidebarCollapsed: boolean;
    rightPanelCollapsed: boolean;
    mainView: MainView;
    tasksViewMode: TasksViewMode;
    calendarView: CalendarView;
    selectedDate: Date;
    selectedEvent: Event | null;
    searchQuery: string;
    selectedWorkspaceId: number | null;
    createEventDialogOpen: boolean;
    createEventInitialStart: Date | null;
    createEventInitialEnd: Date | null;
    toggleLeftSidebar: () => void;
    toggleRightPanel: () => void;
    setMainView: (view: MainView) => void;
    setTasksViewMode: (mode: TasksViewMode) => void;
    setCalendarView: (view: CalendarView) => void;
    setSelectedDate: (date: Date) => void;
    selectEvent: (event: Event) => void;
    clearSelectedEvent: () => void;
    setSearchQuery: (query: string) => void;
    setSelectedWorkspaceId: (workspaceId: number | null) => void;
    openCreateEventDialog: (options?: { start?: Date; end?: Date }) => void;
    closeCreateEventDialog: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
    leftSidebarCollapsed: true,
    rightPanelCollapsed: true,
    mainView: "calendar",
    tasksViewMode: "list",
    calendarView: "month",
    selectedDate: new Date(),
    selectedEvent: null,
    searchQuery: "",
    selectedWorkspaceId: null,
    createEventDialogOpen: false,
    createEventInitialStart: null,
    createEventInitialEnd: null,

    toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed })),

    toggleRightPanel: () =>
        set((state) => ({ rightPanelCollapsed: !state.rightPanelCollapsed })),

    setMainView: (view) => set({ mainView: view }),

    setTasksViewMode: (mode) => set({ tasksViewMode: mode }),

    setCalendarView: (view) => set({ calendarView: view }),

    setSelectedDate: (date) => set({ selectedDate: date }),

    selectEvent: (event) =>
        set({
            selectedEvent: event,
            selectedDate: event.start,
            rightPanelCollapsed: false,
        }),

    clearSelectedEvent: () => set({ selectedEvent: null }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    setSelectedWorkspaceId: (workspaceId) =>
        set({ selectedWorkspaceId: workspaceId }),

    openCreateEventDialog: (options) => {
        const start = options?.start ? new Date(options.start) : new Date();
        const end = options?.end
            ? new Date(options.end)
            : new Date(start.getTime() + 3_600_000);
        set({
            createEventDialogOpen: true,
            createEventInitialStart: start,
            createEventInitialEnd: end,
        });
    },

    closeCreateEventDialog: () =>
        set({
            createEventDialogOpen: false,
            createEventInitialStart: null,
            createEventInitialEnd: null,
        }),
}));
