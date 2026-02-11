import { create } from "zustand";

type CalendarView = "month" | "week";

type DashboardState = {
    leftSidebarCollapsed: boolean;
    rightPanelCollapsed: boolean;
    calendarView: CalendarView;
    selectedDate: Date;
    searchQuery: string;
    selectedWorkspaceId: number | null;
    toggleLeftSidebar: () => void;
    toggleRightPanel: () => void;
    setCalendarView: (view: CalendarView) => void;
    setSelectedDate: (date: Date) => void;
    setSearchQuery: (query: string) => void;
    setSelectedWorkspaceId: (workspaceId: number | null) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
    leftSidebarCollapsed: false,
    rightPanelCollapsed: false,
    calendarView: "month",
    selectedDate: new Date(),
    searchQuery: "",
    selectedWorkspaceId: null,

    toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed })),

    toggleRightPanel: () =>
        set((state) => ({ rightPanelCollapsed: !state.rightPanelCollapsed })),

    setCalendarView: (view) => set({ calendarView: view }),

    setSelectedDate: (date) => set({ selectedDate: date }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    setSelectedWorkspaceId: (workspaceId) =>
        set({ selectedWorkspaceId: workspaceId }),
}));
