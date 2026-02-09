import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateWorkspace } from "../hooks/useCreateWorkspace";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CreateWorkspaceDialogProps {
    trigger: React.ReactNode;
}

export default function CreateWorkspaceDialog({
    trigger
}: CreateWorkspaceDialogProps) {
    const [name, setName] = useState("Untitled");
    const [description, setDescription] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const { mutate: createWorkspace, isPending } = useCreateWorkspace();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createWorkspace({ name, description }, {
            onSuccess: () => {
                setName("Untitled");
                setDescription("");
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Create a new workspace to organize your tasks.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
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
                                autoFocus
                                onFocus={(e) => e.target.select()}
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
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
