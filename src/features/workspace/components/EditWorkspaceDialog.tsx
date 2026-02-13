import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useUpdateWorkspace } from "@/features/workspace/hooks/useUpdateWorkspace";
import { type Workspace } from "@/features/workspace/models/Workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditWorkspaceDialogProps {
    trigger: React.ReactNode;   
    workspace: Workspace;
}

export default function EditWorkspaceDialog({
    trigger,
    workspace,
}: EditWorkspaceDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(workspace.name);
    const [description, setDescription] = useState(workspace.description || "");

    const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

    useEffect(() => {
        setName(workspace.name);
        setDescription(workspace.description || "");
    }, [workspace]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateWorkspace({
            id: workspace.id,
            updates: { name, description },
        }, {
            onSuccess: () => {
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                <DialogHeader>
                    <DialogTitle>
                        Edit Workspace
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-stone-700">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. My Awesome Project"
                                required
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-stone-700">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this workspace for?"
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                            />
                        </div>
                        <div className="flex justify-end items-center pt-2">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-[#8d9b67] text-white hover:bg-[#7f8d5c]"
                            >
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
