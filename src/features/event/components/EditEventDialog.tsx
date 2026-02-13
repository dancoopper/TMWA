import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event } from "@/features/event/models/Event";
import { useUpdateEvent } from "@/features/event/hooks/useUpdateEvent";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import {
    normalizeTemplateFields,
    type TemplateField,
    type TemplateFieldType,
} from "@/features/template/templateFields";
import {
    normalizeEventValues,
    type EventFieldValue,
} from "@/features/event/eventFieldValues";
import { useCreateTemplate } from "@/features/template/hooks/useCreateTemplate";
import { useUpdateTemplate } from "@/features/template/hooks/useUpdateTemplate";

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

const DEFAULT_FIELD_TYPE: TemplateFieldType = "text";

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
    const [schema, setSchema] = useState<TemplateField[]>([]);
    const [detailValues, setDetailValues] = useState<EventFieldValue[]>([]);
    const [newFieldKey, setNewFieldKey] = useState("");
    const [newFieldType, setNewFieldType] = useState<TemplateFieldType>(DEFAULT_FIELD_TYPE);

    const { mutateAsync: updateEventAsync, isPending } = useUpdateEvent();
    const {
        mutateAsync: createTemplateAsync,
        isPending: isCreateTemplatePending,
    } = useCreateTemplate();
    const {
        mutateAsync: updateTemplateAsync,
        isPending: isUpdateTemplatePending,
    } = useUpdateTemplate();
    const { data: templates = [] } = useTemplates({ includeHidden: true });
    const currentTemplate = useMemo(
        () => templates.find((template) => template.id === event.templateId) ?? null,
        [templates, event.templateId],
    );
    const isSubmitting = isPending || isCreateTemplatePending || isUpdateTemplatePending;

    useEffect(() => {
        const nextSchema = normalizeTemplateFields(currentTemplate?.data ?? []);
        setTitle(event.title);
        setDateValue(toDateInputValue(event.date));
        setTimeValue(toTimeInputValue(event.date));
        setSchema(nextSchema);
        setDetailValues(normalizeEventValues(nextSchema, event.data));
        setNewFieldKey("");
        setNewFieldType(DEFAULT_FIELD_TYPE);
    }, [event, event.data, currentTemplate?.data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedDate = new Date(`${dateValue}T${timeValue}:00`);
        const normalizedSchema = normalizeTemplateFields(schema);
        const normalizedValues = normalizeEventValues(normalizedSchema, detailValues);
        const currentSchema = normalizeTemplateFields(currentTemplate?.data ?? []);
        const schemaChanged =
            JSON.stringify(normalizedSchema) !== JSON.stringify(currentSchema);
        let nextTemplateId = event.templateId;

        if (normalizedSchema.length > 0 && schemaChanged) {
            if (currentTemplate?.isHidden) {
                await updateTemplateAsync({
                    id: currentTemplate.id,
                    data: normalizedSchema,
                });
            } else {
                const hiddenTemplate = await createTemplateAsync({
                    name: `Hidden template ${Date.now()}`,
                    data: normalizedSchema,
                    isHidden: true,
                });
                nextTemplateId = hiddenTemplate.id;
            }
        }

        const updatedEvent = await updateEventAsync({
            id: event.id,
            title: title.trim(),
            date: parsedDate,
            templateId: nextTemplateId,
            data: normalizedValues,
        });
        onEventUpdated?.(updatedEvent);
        setIsOpen(false);
    };

    const updateDetailValue = (fieldId: string, value: EventFieldValue["value"]) => {
        setDetailValues((current) =>
            current.map((item) => (item.id === fieldId ? { ...item, value } : item)),
        );
    };

    const handleAddField = () => {
        if (!newFieldKey.trim()) return;
        const nextField: TemplateField = {
            id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: newFieldKey.trim(),
            type: newFieldType,
            options: newFieldType === "select" ? ["Option 1", "Option 2"] : undefined,
        };
        const nextSchema = [...schema, nextField];
        setSchema(nextSchema);
        setDetailValues((current) => normalizeEventValues(nextSchema, current));
        setNewFieldKey("");
        setNewFieldType(DEFAULT_FIELD_TYPE);
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
                        <div className="space-y-2">
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
                    ) : (
                        <p className="text-xs text-stone-500">No fields yet. Add one below.</p>
                    )}
                    <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                        <Input
                            value={newFieldKey}
                            onChange={(e) => setNewFieldKey(e.target.value)}
                            placeholder="Field Name"
                            disabled={isSubmitting}
                        />
                        <select
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value as TemplateFieldType)}
                            className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
                            disabled={isSubmitting}
                        >
                            <option value="text">Text</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="select">Select</option>
                        </select>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddField}
                            disabled={isSubmitting || !newFieldKey.trim()}
                        >
                            +
                        </Button>
                    </div>
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
