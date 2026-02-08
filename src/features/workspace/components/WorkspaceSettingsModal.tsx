import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
                    <DialogTitle>Workspace Settings</DialogTitle>
                </DialogHeader>

                <div className="py-2 space-y-6">
                    <EditWorkspaceForm
                        workspace={selectedWorkspace}
                        onSuccess={closeSettings}
                    />

                    <Separator />

                    <DeleteWorkspaceSection
                        workspace={selectedWorkspace}
                        onSuccess={closeSettings}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
