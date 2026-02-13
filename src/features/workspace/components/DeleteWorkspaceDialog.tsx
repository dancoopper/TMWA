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
import { Trash2 } from "lucide-react";

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
            <AlertDialogContent size="sm" className="border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-rose-500/20 text-rose-700">
                        <Trash2 className="w-6 h-6" />
                    </AlertDialogMedia>
                    <AlertDialogTitle className="text-stone-800">Delete workspace?</AlertDialogTitle>
                    <AlertDialogDescription className="text-stone-600">
                        This will permanently delete the workspace{" "}
                        <strong>{workspace.name}</strong>. This action cannot be
                        undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        variant="outline"
                        className="border-stone-500/50 bg-stone-200/60 text-stone-700 hover:bg-stone-300/70 hover:text-stone-800"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        className="bg-rose-700 text-white hover:bg-rose-800"
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
