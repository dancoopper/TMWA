import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Event, EventColorKey } from "@/features/event/models/Event";
import { EventColorPicker } from "./EventColorPicker";
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
import { toast } from "sonner";

interface EditEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: React.ReactNode;
    event: Event;
    onEventUpdated?: (event: Event) => void;
}

const DEFAULT_FIELD_TYPE: TemplateFieldType = "text";
const HOUR_MS = 3_600_000;

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
    open,
    onOpenChange,
    trigger,
    event,
    onEventUpdated,
}: EditEventDialogProps) {
    const [title, setTitle] = useState(event.title);
    const [startDateValue, setStartDateValue] = useState(toDateInputValue(event.start));
    const [startTimeValue, setStartTimeValue] = useState(toTimeInputValue(event.start));
    const [endDateValue, setEndDateValue] = useState(toDateInputValue(event.end));
    const [endTimeValue, setEndTimeValue] = useState(toTimeInputValue(event.end));
    const [schema, setSchema] = useState<TemplateField[]>([]);
    const [detailValues, setDetailValues] = useState<EventFieldValue[]>([]);
    const [newFieldKey, setNewFieldKey] = useState("");
    const [newFieldType, setNewFieldType] = useState<TemplateFieldType>(DEFAULT_FIELD_TYPE);
    const [colorKey, setColorKey] = useState<EventColorKey>(event.colorKey);

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

    const bumpEndByHours = (deltaHours: number) => {
        const start = new Date(`${startDateValue}T${startTimeValue}:00`);
        const end = new Date(`${endDateValue}T${endTimeValue}:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
        const next = new Date(end.getTime() + deltaHours * HOUR_MS);
        if (next.getTime() <= start.getTime()) return;
        setEndDateValue(toDateInputValue(next));
        setEndTimeValue(toTimeInputValue(next));
    };

    const canShrinkEndByOneHour = useMemo(() => {
        const start = new Date(`${startDateValue}T${startTimeValue}:00`);
        const end = new Date(`${endDateValue}T${endTimeValue}:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
        return end.getTime() - start.getTime() > HOUR_MS;
    }, [startDateValue, startTimeValue, endDateValue, endTimeValue]);

    useEffect(() => {
        const nextSchema = normalizeTemplateFields(currentTemplate?.data ?? []);
        setTitle(event.title);
        setStartDateValue(toDateInputValue(event.start));
        setStartTimeValue(toTimeInputValue(event.start));
        setEndDateValue(toDateInputValue(event.end));
        setEndTimeValue(toTimeInputValue(event.end));
        setSchema(nextSchema);
        setDetailValues(normalizeEventValues(nextSchema, event.data));
        setNewFieldKey("");
        setNewFieldType(DEFAULT_FIELD_TYPE);
        setColorKey(event.colorKey);
    }, [event, event.data, currentTemplate?.data]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const start = new Date(`${startDateValue}T${startTimeValue}:00`);
        const end = new Date(`${endDateValue}T${endTimeValue}:00`);
        if (end.getTime() <= start.getTime()) {
            toast.error("End time must be after start time.");
            return;
        }
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
            start,
            end,
            templateId: nextTemplateId,
            data: normalizedValues,
            colorKey,
        });
        onEventUpdated?.(updatedEvent);
        onOpenChange(false);
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                <DialogHeader>
                    <DialogTitle className="text-stone-800">Edit Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="edit-event-title" className="text-stone-700">Title</Label>
                        <Input
                            id="edit-event-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="border-stone-400/50 bg-[#efe9dc] text-stone-800 focus-visible:ring-sky-500/25"
                        />
                    </div>
                    <EventColorPicker
                        id="edit-event-color"
                        value={colorKey}
                        onChange={setColorKey}
                        disabled={isSubmitting}
                    />
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase text-stone-500">Starts</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="edit-start-date" className="text-stone-700">Date</Label>
                                <Input
                                    id="edit-start-date"
                                    type="date"
                                    value={startDateValue}
                                    onChange={(e) => setStartDateValue(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-start-time" className="text-stone-700">Time</Label>
                                <Input
                                    id="edit-start-time"
                                    type="time"
                                    value={startTimeValue}
                                    onChange={(e) => setStartTimeValue(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase text-stone-500">Ends</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="edit-end-date" className="text-stone-700">Date</Label>
                                <Input
                                    id="edit-end-date"
                                    type="date"
                                    value={endDateValue}
                                    onChange={(e) => setEndDateValue(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                                />
                            </div>
                            <div className="space-y-2 min-w-0">
                                <Label htmlFor="edit-end-time" className="text-stone-700">Time</Label>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={isSubmitting || !canShrinkEndByOneHour}
                                        aria-label="End one hour earlier"
                                        onClick={() => bumpEndByHours(-1)}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-stone-400/50 bg-[#efe9dc] text-lg font-medium text-stone-800 leading-none hover:bg-stone-300/50 disabled:opacity-40 disabled:pointer-events-none"
                                    >
                                        -
                                    </button>
                                    <Input
                                        id="edit-end-time"
                                        type="time"
                                        value={endTimeValue}
                                        onChange={(e) => setEndTimeValue(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        className="min-w-0 flex-1 border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25 [&::-webkit-calendar-picker-indicator]:hidden"
                                    />
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        aria-label="End one hour later"
                                        onClick={() => bumpEndByHours(1)}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-stone-400/50 bg-[#efe9dc] text-lg font-medium text-stone-800 leading-none hover:bg-stone-300/50 disabled:opacity-40 disabled:pointer-events-none"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
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
                                                className="accent-[#8d9b67]"
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
                                                className="h-9 w-full rounded-md border border-stone-400/50 bg-[#efe9dc] px-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
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
                                            className="border-stone-400/50 bg-[#efe9dc] text-stone-800 focus-visible:ring-sky-500/25"
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
                            className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                        />
                        <select
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value as TemplateFieldType)}
                            className="h-9 rounded-md border border-stone-400/50 bg-[#efe9dc] px-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
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
                            className="border-stone-500/50 bg-stone-200/60 text-stone-700 hover:bg-stone-300/70 hover:text-stone-800"
                        >
                            +
                        </Button>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="border-stone-500/50 bg-stone-200/60 text-stone-700 hover:bg-stone-300/70 hover:text-stone-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
