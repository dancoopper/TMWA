import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateWorkspace } from "../hooks/useUpdateWorkspace";
import { type Workspace } from "../models/Workspace";

interface EditWorkspaceModalProps {
    workspace: Workspace | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditWorkspaceModal(
    { workspace, open, onOpenChange }: EditWorkspaceModalProps,
) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

    useEffect(() => {
        if (workspace && open) {
            setName(workspace.name);
            setDescription(workspace.description || "");
        }
    }, [workspace, open]);

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!workspace) return;

        updateWorkspace({
            id: workspace.id,
            updates: { name, description },
        }, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[425px]"
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.select();
                    }
                }}
            >
                <form onSubmit={handleUpdate}>
                    <DialogHeader>
                        <DialogTitle>Edit Workspace</DialogTitle>
                        <DialogDescription>
                            Make changes to your workspace here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-1">
                            <Label
                                htmlFor="edit-name"
                                className="text-gray-500"
                            >
                                Name
                            </Label>
                            <Input
                                id="edit-name"
                                ref={inputRef}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="Workspace Name"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label
                                htmlFor="edit-description"
                                className="text-gray-500"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3 min-h-[100px]"
                                placeholder="Enter a description..."
                                disabled={isPending}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
