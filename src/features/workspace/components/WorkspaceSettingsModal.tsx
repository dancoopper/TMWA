import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useWorkspaceStore } from "@/stores/workspaceStore";
import DeleteWorkspaceSection from "./DeleteWorkspaceSection";
import EditWorkspaceForm from "./EditWorkspaceForm";

export default function WorkspaceSettingsModal() {
    const {
        selectedWorkspace,
        isSettingsOpen,
        closeSettings,
    } = useWorkspaceStore();

    if (!selectedWorkspace) return null;

    return (
        <Dialog
            open={isSettingsOpen}
            onOpenChange={(open) => !open && closeSettings()}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="mr-2">
                            Workspace Settings
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2 space-y-6">
                    <EditWorkspaceForm
                        workspace={selectedWorkspace}
                        onSuccess={closeSettings}
                    >
                        <DeleteWorkspaceSection
                            workspace={selectedWorkspace}
                            onSuccess={closeSettings}
                        />
                    </EditWorkspaceForm>
                </div>

            </DialogContent>
        </Dialog>
    );
}
