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
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash, Trash2 } from "lucide-react";

interface DeleteWorkspaceDialogProps {
    trigger: React.ReactNode;
    workspace: Workspace;
}

export default function DeleteWorkspaceDialog({
    trigger,
    workspace,
}: DeleteWorkspaceDialogProps) {
    const [open, setOpen] = useState(false);
    const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace();

    const handleDelete = () => {
        deleteWorkspace(workspace.id, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2 className="w-6 h-6" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the workspace{" "}
                        <strong>{workspace.name}</strong>. This action cannot be
                        undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
