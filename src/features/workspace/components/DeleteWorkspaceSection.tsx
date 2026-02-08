import { useState } from "react";
import { useDeleteWorkspace } from "@/features/workspace/hooks/useDeleteWorkspace";
import { type Workspace } from "@/features/workspace/models/Workspace";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteWorkspaceSectionProps {
    workspace: Workspace;
    onSuccess?: () => void;
}

export default function DeleteWorkspaceSection({
    workspace,
    onSuccess,
}: DeleteWorkspaceSectionProps) {
    const [open, setOpen] = useState(false);
    const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace();

    const handleDelete = () => {
        deleteWorkspace(workspace.id, {
            onSuccess: () => {
                setOpen(false);
                onSuccess?.();
            },
        });
    };

    return (
        <div className="border border-red-200 rounded-md p-4 bg-red-50/50">
            <h3 className="text-sm font-medium text-red-900 mb-2">
                Danger Zone
            </h3>
            <p className="text-xs text-red-600 mb-4">
                Deleting a workspace is permanent and cannot be undone. All data
                associated with this workspace will be lost.
            </p>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        Delete Workspace
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the workspace{" "}
                            <strong>{workspace.name}</strong>{" "}
                            and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isPending}
                        >
                            {isPending ? "Deleting..." : "Delete Workspace"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
