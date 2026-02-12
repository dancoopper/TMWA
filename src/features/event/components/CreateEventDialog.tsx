import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEvent } from "../hooks/useCreateEvent";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";


interface CreateEventDialogProps {
    trigger: React.ReactNode;
}

export default function CreateEventDialog({
    trigger
}: CreateEventDialogProps) {
    const [title, setTitle] = useState("Untitled");
    const [description, setDescription] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const { mutate: createEvent, isPending } = useCreateEvent();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createEvent({ name, description }, {
            onSuccess: () => {
                setName("Untitled");
                setDescription("");
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="title" className="text-gray-500">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    ref={inputRef}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
