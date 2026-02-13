import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event } from "@/features/event/models/Event";
import { useUpdateEvent } from "@/features/event/hooks/useUpdateEvent";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface EditEventDialogProps {
    trigger: React.ReactNode;
    event: Event;
    onEventUpdated?: (event: Event) => void;
}

function toDateInputValue(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function toTimeInputValue(date: Date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

export default function EditEventDialog({
    trigger,
    event,
    onEventUpdated,
}: EditEventDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState(event.title);
    const [dateValue, setDateValue] = useState(toDateInputValue(event.date));
    const [timeValue, setTimeValue] = useState(toTimeInputValue(event.date));

    const { mutate: updateEvent, isPending } = useUpdateEvent();

    useEffect(() => {
        setTitle(event.title);
        setDateValue(toDateInputValue(event.date));
        setTimeValue(toTimeInputValue(event.date));
    }, [event]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedDate = new Date(`${dateValue}T${timeValue}:00`);

        updateEvent(
            {
                id: event.id,
                title: title.trim(),
                date: parsedDate,
            },
            {
                onSuccess: (updatedEvent) => {
                    onEventUpdated?.(updatedEvent);
                    setIsOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="edit-event-title">Title</Label>
                        <Input
                            id="edit-event-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isPending}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="edit-event-date">Date</Label>
                            <Input
                                id="edit-event-date"
                                type="date"
                                value={dateValue}
                                onChange={(e) => setDateValue(e.target.value)}
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-event-time">Time</Label>
                            <Input
                                id="edit-event-time"
                                type="time"
                                value={timeValue}
                                onChange={(e) => setTimeValue(e.target.value)}
                                required
                                disabled={isPending}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !title.trim()}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
