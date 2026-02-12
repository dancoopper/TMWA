import { useRef, useState } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useCreateTemplate } from "../hooks/useCreateTemplate";
import { useAuthStore } from "@/stores/authStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useGetTemplateById } from "../hooks/useGetTemplateById";

interface CreateEventDialogProps {
    trigger: React.ReactNode;
}

export default function CreateEventDialog({
    trigger
}: CreateEventDialogProps) {
    const [title, setTitle] = useState("Untitled");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const { selectedWorkspaceId } = useDashboardStore();

    const { mutate: createEvent, isPending } = useCreateEvent();


    const { mutateAsync: createTemplate } = useCreateTemplate();
    const { session, userProfile } = useAuthStore();
    const { data: templateData, isLoading: isTemplateLoading } = useGetTemplateById(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Add workspace selection
        if (!selectedWorkspaceId) {
            toast.error("Please select a workspace first");
            return;
        }

        if (!session?.user.id) throw new Error("No active session");
        const userId = session?.user.id;

        // If template doesn't exist (and we're not currently loading it), try to create it
        if (!templateData && !isTemplateLoading) {
            try {
                await createTemplate({
                    createdAt: date.toISOString(),
                    userId,
                    data: [
                        {
                            id: 1,
                            name: "Title",
                            type: "text",
                        },
                        {
                            id: 2,
                            name: "Description",
                            type: "text",
                        },
                        {
                            id: 3,
                            name: "Date",
                            type: "date",
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to create default template", error);
                // Continue anyway, maybe createEvent will work or fail with a clear error
            }
        }

        createEvent({
            title,
            data: [
                {
                    id: 1,
                    value: description,
                }
            ],
            templateId: 1, // Start with a default template ID
            workspaceId: selectedWorkspaceId,
            date,
        }, {
            onSuccess: () => {
                setIsOpen(false);
                setTitle("Untitled");
                setDescription("");
                setDate(new Date());
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Event</DialogTitle>
                    <DialogDescription>
                        Add a new event to your workspace.
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

                        <div className="flex flex-col gap-1">
                            <Label
                                htmlFor="date"
                                className="text-gray-500"
                            >
                                Date
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={date.toISOString().split("T")[0]}
                                onChange={(e) => setDate(new Date(e.target.value))}
                                className="col-span-3"
                                disabled={isPending}
                                required
                            />
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
