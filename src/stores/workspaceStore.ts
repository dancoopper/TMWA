import { create } from "zustand";
import { type Workspace } from "@/features/workspace/models/Workspace";

type WorkspaceStore = {
    selectedWorkspace: Workspace | null;
    isSettingsOpen: boolean;
    openSettings: (workspace: Workspace) => void;
    closeSettings: () => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
    selectedWorkspace: null,
    isSettingsOpen: false,

    openSettings: (workspace) =>
        set({ selectedWorkspace: workspace, isSettingsOpen: true }),

    closeSettings: () =>
        set({ selectedWorkspace: null, isSettingsOpen: false }),
}));
