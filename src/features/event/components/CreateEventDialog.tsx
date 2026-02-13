import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateEvent } from "../hooks/useCreateEvent";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import type { TemplateField, TemplateFieldType } from "@/features/template/templateFields";
import {
    buildDefaultEventValues,
    normalizeEventValues,
    type EventFieldValue,
} from "@/features/event/eventFieldValues";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const DEFAULT_TITLE = "Untitled";
const DEFAULT_TIME = "09:00";
const DEFAULT_FIELD_TYPE: TemplateFieldType = "text";

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
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [customSchema, setCustomSchema] = useState<TemplateField[]>([]);
    const [eventValues, setEventValues] = useState<EventFieldValue[]>([]);
    const [newFieldKey, setNewFieldKey] = useState("");
    const [newFieldType, setNewFieldType] = useState<TemplateFieldType>(DEFAULT_FIELD_TYPE);
    const inputRef = useRef<HTMLInputElement>(null);
    const { mutate: createEvent, isPending } = useCreateEvent();
    const { data: templates = [] } = useTemplates();

    const selectedTemplate = useMemo(
        () => templates.find((template) => template.id === selectedTemplateId) ?? null,
        [selectedTemplateId, templates],
    );
    const activeSchema = selectedTemplate ? selectedTemplate.data : customSchema;
    const isSubmitting = isPending;

    useEffect(() => {
        if (!activeSchema.length) return;
        setEventValues((current) => normalizeEventValues(activeSchema, current));
    }, [activeSchema]);

    useEffect(() => {
        if (!open) return;
        if (templates.length > 0) {
            setSelectedTemplateId(templates[0].id);
            setCustomSchema(templates[0].data);
            setEventValues(normalizeEventValues(templates[0].data, []));
            return;
        }
        const starterSchema: TemplateField[] = [];
        setSelectedTemplateId(null);
        setCustomSchema(starterSchema);
        setEventValues(buildDefaultEventValues(starterSchema));
    }, [open, templates]);

    useEffect(() => {
        if (!open) return;
        const nextDate = initialDate ?? new Date();
        setDateValue(toDateInputValue(nextDate));
        setTimeValue(getDefaultTimeValue(initialDate));
        setTitle(DEFAULT_TITLE);
        setNewFieldKey("");
        setNewFieldType(DEFAULT_FIELD_TYPE);
    }, [initialDate, open]);

    const resetForm = () => {
        setTitle(DEFAULT_TITLE);
        const nextDate = initialDate ?? new Date();
        setDateValue(toDateInputValue(nextDate));
        setTimeValue(getDefaultTimeValue(initialDate));
        setNewFieldKey("");
        setNewFieldType(DEFAULT_FIELD_TYPE);
        if (templates.length > 0) {
            setSelectedTemplateId(templates[0].id);
            setCustomSchema(templates[0].data);
            setEventValues(normalizeEventValues(templates[0].data, []));
        } else {
            const starterSchema: TemplateField[] = [];
            setSelectedTemplateId(null);
            setCustomSchema(starterSchema);
            setEventValues(buildDefaultEventValues(starterSchema));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const parsedDate = new Date(`${dateValue}T${timeValue || DEFAULT_TIME}:00`);
        const normalizedValues = normalizeEventValues(activeSchema, eventValues);

        createEvent(
            {
                title,
                date: parsedDate,
                selectedTemplateId: selectedTemplateId ?? undefined,
                schema: activeSchema,
                data: normalizedValues,
            },
            {
                onSuccess: () => {
                    resetForm();
                    onOpenChange(false);
                },
            }
        );
    };

    const handleFieldValueChange = (fieldId: string, value: EventFieldValue["value"]) => {
        setEventValues((current) =>
            current.map((item) => (item.id === fieldId ? { ...item, value } : item)),
        );
    };

    const handleAddField = () => {
        if (!newFieldKey.trim()) return;
        const base = selectedTemplate ? selectedTemplate.data : customSchema;
        const nextField: TemplateField = {
            id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: newFieldKey.trim(),
            type: newFieldType,
            options: newFieldType === "select" ? ["Option 1", "Option 2"] : undefined,
        };
        const nextSchema = [...base, nextField];
        setSelectedTemplateId(null);
        setCustomSchema(nextSchema);
        setEventValues((current) => normalizeEventValues(nextSchema, current));
        setNewFieldKey("");
        setNewFieldType(DEFAULT_FIELD_TYPE);
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
            <DialogContent className="sm:max-w-[425px] border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                <DialogHeader>
                    <DialogTitle className="text-stone-800">Create Event</DialogTitle>
                    <DialogDescription className="text-stone-600">Add details and save.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-stone-700">Title</Label>
                        <Input
                            id="title"
                            ref={inputRef}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={DEFAULT_TITLE}
                            required
                            disabled={isSubmitting}
                            autoFocus
                            onFocus={(e) => e.target.select()}
                            className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-stone-700">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={dateValue}
                                onChange={(e) => setDateValue(e.target.value)}
                                required
                                disabled={isSubmitting}
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-stone-700">Time</Label>
                            <Input
                                id="time"
                                type="time"
                                value={timeValue}
                                onChange={(e) => setTimeValue(e.target.value)}
                                disabled={isSubmitting}
                                className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                            />
                        </div>
                    </div>

                    {activeSchema.length > 0 ? (
                        <div className="space-y-2">
                            {activeSchema.map((field) => {
                                const currentValue = eventValues.find((item) => item.id === field.id)?.value;

                                if (field.type === "checkbox") {
                                    return (
                                        <label key={field.id} className="flex items-center gap-2 text-sm text-stone-700">
                                            <input
                                                type="checkbox"
                                                checked={currentValue === true}
                                                onChange={(e) => handleFieldValueChange(field.id, e.target.checked)}
                                                disabled={isSubmitting}
                                                className="accent-[#8d9b67]"
                                            />
                                            {field.name}
                                        </label>
                                    );
                                }

                                if (field.type === "select") {
                                    const options = field.options ?? [];
                                    return (
                                        <div key={field.id} className="space-y-1">
                                            <Label className="text-xs text-stone-600">{field.name}</Label>
                                            <select
                                                value={typeof currentValue === "string" ? currentValue : ""}
                                                onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                                                className="h-9 w-full rounded-md border border-stone-400/50 bg-[#efe9dc] px-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select</option>
                                                {options.map((option) => (
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
                                            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                                            placeholder={field.name}
                                            disabled={isSubmitting}
                                            className="border-stone-400/50 bg-[#efe9dc] text-stone-800 placeholder:text-stone-500 focus-visible:ring-sky-500/25"
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
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
