import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event } from "@/features/event/models/Event";
import { useUpdateEvent } from "@/features/event/hooks/useUpdateEvent";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import { normalizeTemplateFields, type TemplateField } from "@/features/template/templateFields";
import {
    normalizeEventValues,
    type EventFieldValue,
} from "@/features/event/eventFieldValues";
import { useCreateTemplate } from "@/features/template/hooks/useCreateTemplate";

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
    const [detailValues, setDetailValues] = useState<EventFieldValue[]>([]);
    const [templateName, setTemplateName] = useState("");

    const { mutate: updateEvent, isPending } = useUpdateEvent();
    const {
        mutate: createTemplate,
        isPending: isCreateTemplatePending,
    } = useCreateTemplate();
    const { data: templates = [] } = useTemplates({ includeHidden: true });
    const currentTemplate = useMemo(
        () => templates.find((template) => template.id === event.templateId) ?? null,
        [templates, event.templateId],
    );
    const schema: TemplateField[] = useMemo(
        () => normalizeTemplateFields(currentTemplate?.data ?? []),
        [currentTemplate?.data],
    );
    const isSubmitting = isPending || isCreateTemplatePending;

    useEffect(() => {
        setTitle(event.title);
        setDateValue(toDateInputValue(event.date));
        setTimeValue(toTimeInputValue(event.date));
        setDetailValues(normalizeEventValues(schema, event.data));
    }, [event, event.data, schema]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedDate = new Date(`${dateValue}T${timeValue}:00`);
        const normalizedValues = normalizeEventValues(schema, detailValues);

        updateEvent(
            {
                id: event.id,
                title: title.trim(),
                date: parsedDate,
                data: normalizedValues,
            },
            {
                onSuccess: (updatedEvent) => {
                    onEventUpdated?.(updatedEvent);
                    setIsOpen(false);
                },
            }
        );
    };

    const handleSaveTemplate = () => {
        if (!templateName.trim() || schema.length === 0) return;
        createTemplate(
            {
                name: templateName.trim(),
                data: schema,
                isHidden: false,
            },
            {
                onSuccess: (template) => {
                    setTemplateName("");
                    updateEvent({
                        id: event.id,
                        title: title.trim(),
                        date: new Date(`${dateValue}T${timeValue}:00`),
                        templateId: template.id,
                        data: normalizeEventValues(schema, detailValues),
                    });
                },
            }
        );
    };

    const updateDetailValue = (fieldId: string, value: EventFieldValue["value"]) => {
        setDetailValues((current) =>
            current.map((item) => (item.id === fieldId ? { ...item, value } : item)),
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
                            disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    {schema.length > 0 ? (
                        <div className="space-y-2 rounded-md border border-stone-300/60 p-3">
                            <Label className="text-gray-500">Event Details</Label>
                            {schema.map((field) => {
                                const currentValue = detailValues.find((item) => item.id === field.id)?.value;
                                if (field.type === "checkbox") {
                                    return (
                                        <label key={field.id} className="flex items-center gap-2 text-sm text-stone-700">
                                            <input
                                                type="checkbox"
                                                checked={currentValue === true}
                                                onChange={(e) => updateDetailValue(field.id, e.target.checked)}
                                                disabled={isSubmitting}
                                            />
                                            {field.name}
                                        </label>
                                    );
                                }

                                if (field.type === "select") {
                                    return (
                                        <div key={field.id} className="space-y-1">
                                            <Label className="text-xs text-stone-600">{field.name}</Label>
                                            <select
                                                value={typeof currentValue === "string" ? currentValue : ""}
                                                onChange={(e) => updateDetailValue(field.id, e.target.value)}
                                                className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select</option>
                                                {(field.options ?? []).map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={field.id} className="space-y-1">
                                        <Label className="text-xs text-stone-600">{field.name}</Label>
                                        <Input
                                            value={typeof currentValue === "string" ? currentValue : ""}
                                            onChange={(e) => updateDetailValue(field.id, e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                    {schema.length > 0 ? (
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                            <Input
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Save current format as template"
                                disabled={isSubmitting}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleSaveTemplate}
                                disabled={isSubmitting || !templateName.trim()}
                            >
                                Save Format
                            </Button>
                        </div>
                    ) : null}
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !title.trim()}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
