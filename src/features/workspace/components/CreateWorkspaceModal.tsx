import { useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateWorkspace } from "../hooks/useCreateWorkspace";

interface CreateWorkspaceModalProps {
    children: React.ReactNode;
}

export default function CreateWorkspaceModal(
    { children }: CreateWorkspaceModalProps,
) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("Untitled");
    const [description, setDescription] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { mutate: createWorkspace, isPending } = useCreateWorkspace();

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setName("Untitled");
            setDescription("");
        }
        setOpen(open);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        createWorkspace({ name, description }, {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
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
                <form onSubmit={handleCreate}>
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                        <DialogDescription>
                            Create a new workspace to organize your tasks.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="name" className="text-gray-500">
                                Name
                            </Label>
                            <Input
                                id="name"
                                ref={inputRef}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="Untitled"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label
                                htmlFor="description"
                                className="text-gray-500"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
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
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
