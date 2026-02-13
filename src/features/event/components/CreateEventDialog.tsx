import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEvent } from "../hooks/useCreateEvent";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const DEFAULT_TITLE = "Untitled";
const DEFAULT_TIME = "09:00";

interface CreateEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialDate?: Date;
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

function getDefaultTimeValue(date?: Date) {
    if (!date) return DEFAULT_TIME;
    if (date.getHours() !== 0 || date.getMinutes() !== 0) {
        return toTimeInputValue(date);
    }
    return DEFAULT_TIME;
}

export default function CreateEventDialog({
    open,
    onOpenChange,
    initialDate,
}: CreateEventDialogProps) {
    const [title, setTitle] = useState(DEFAULT_TITLE);
    const [dateValue, setDateValue] = useState(toDateInputValue(initialDate ?? new Date()));
    const [timeValue, setTimeValue] = useState(getDefaultTimeValue(initialDate));
    const inputRef = useRef<HTMLInputElement>(null);
    const { mutate: createEvent, isPending } = useCreateEvent();

    useEffect(() => {
        if (!open) return;
        const nextDate = initialDate ?? new Date();
        setDateValue(toDateInputValue(nextDate));
        setTimeValue(getDefaultTimeValue(initialDate));
        setTitle(DEFAULT_TITLE);
    }, [initialDate, open]);

    const resetForm = () => {
        setTitle(DEFAULT_TITLE);
        const nextDate = initialDate ?? new Date();
        setDateValue(toDateInputValue(nextDate));
        setTimeValue(getDefaultTimeValue(initialDate));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedDate = new Date(`${dateValue}T${timeValue || DEFAULT_TIME}:00`);
        createEvent({ title, date: parsedDate }, {
            onSuccess: () => {
                resetForm();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    resetForm();
                }
                onOpenChange(nextOpen);
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Event</DialogTitle>
                    <DialogDescription>
                        Add a new event with a title and date.
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
                                placeholder={DEFAULT_TITLE}
                                required
                                disabled={isPending}
                                autoFocus
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="date" className="text-gray-500">
                                    Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={dateValue}
                                    onChange={(e) => setDateValue(e.target.value)}
                                    required
                                    disabled={isPending}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="time" className="text-gray-500">
                                    Time
                                </Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={timeValue}
                                    onChange={(e) => setTimeValue(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !title.trim()}>
                            {isPending ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
