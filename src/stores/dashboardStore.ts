import { create } from "zustand";
import type { Event } from "@/features/event/models/Event";

type CalendarView = "month" | "week";

type DashboardState = {
    leftSidebarCollapsed: boolean;
    rightPanelCollapsed: boolean;
    calendarView: CalendarView;
    selectedDate: Date;
    selectedEvent: Event | null;
    searchQuery: string;
    selectedWorkspaceId: number | null;
    createEventDialogOpen: boolean;
    createEventInitialDate: Date | null;
    toggleLeftSidebar: () => void;
    toggleRightPanel: () => void;
    setCalendarView: (view: CalendarView) => void;
    setSelectedDate: (date: Date) => void;
    selectEvent: (event: Event) => void;
    clearSelectedEvent: () => void;
    setSearchQuery: (query: string) => void;
    setSelectedWorkspaceId: (workspaceId: number | null) => void;
    openCreateEventDialog: (date?: Date) => void;
    closeCreateEventDialog: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
    leftSidebarCollapsed: true,
    rightPanelCollapsed: true,
    calendarView: "month",
    selectedDate: new Date(),
    selectedEvent: null,
    searchQuery: "",
    selectedWorkspaceId: null,
    createEventDialogOpen: false,
    createEventInitialDate: null,

    toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed })),

    toggleRightPanel: () =>
        set((state) => ({ rightPanelCollapsed: !state.rightPanelCollapsed })),

    setCalendarView: (view) => set({ calendarView: view }),

    setSelectedDate: (date) => set({ selectedDate: date }),

    selectEvent: (event) =>
        set({
            selectedEvent: event,
            selectedDate: event.date,
            rightPanelCollapsed: false,
        }),

    clearSelectedEvent: () => set({ selectedEvent: null }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    setSelectedWorkspaceId: (workspaceId) =>
        set({ selectedWorkspaceId: workspaceId }),

    openCreateEventDialog: (date) =>
        set({
            createEventDialogOpen: true,
            createEventInitialDate: date ? new Date(date) : null,
        }),

    closeCreateEventDialog: () =>
        set({
            createEventDialogOpen: false,
            createEventInitialDate: null,
        }),
}));
