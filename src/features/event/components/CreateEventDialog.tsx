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
import { normalizeTemplateFields } from "@/features/template/templateFields";
import { toast } from "sonner";

const DEFAULT_TITLE = "Untitled";
const DEFAULT_TIME = "09:00";
const DEFAULT_FIELD_TYPE: TemplateFieldType = "text";

interface CreateEventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialStart?: Date;
    initialEnd?: Date;
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

/** Calendar-day clicks use midnight local time; treat that as “no time yet” and use DEFAULT_TIME. */
function effectiveStartFromInitial(initialStart?: Date): Date {
    if (!initialStart) {
        return new Date();
    }
    const base = new Date(initialStart);
    const y = base.getFullYear();
    const m = base.getMonth();
    const d = base.getDate();
    const isMidnight =
        base.getHours() === 0 &&
        base.getMinutes() === 0 &&
        base.getSeconds() === 0 &&
        base.getMilliseconds() === 0;
    if (isMidnight) {
        const [hh, mm] = DEFAULT_TIME.split(":").map(Number);
        return new Date(y, m, d, hh, mm, 0, 0);
    }
    return base;
}

export default function CreateEventDialog({
    open,
    onOpenChange,
    initialStart,
    initialEnd,
}: CreateEventDialogProps) {
    const [title, setTitle] = useState(DEFAULT_TITLE);
    const [startDateValue, setStartDateValue] = useState(toDateInputValue(new Date()));
    const [startTimeValue, setStartTimeValue] = useState(DEFAULT_TIME);
    const [endDateValue, setEndDateValue] = useState(toDateInputValue(new Date()));
    const [endTimeValue, setEndTimeValue] = useState(DEFAULT_TIME);
    const [repeatWeekly, setRepeatWeekly] = useState(false);
    const [repeatWeeks, setRepeatWeeks] = useState(8);
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
    const activeSchema = useMemo(
        () => normalizeTemplateFields(selectedTemplate?.data ?? customSchema),
        [selectedTemplate, customSchema],
    );
    const isSubmitting = isPending;

    const setEndToOneHourAfterStart = (nextStartDate: string, nextStartTime: string) => {
        const start = new Date(`${nextStartDate}T${nextStartTime || DEFAULT_TIME}:00`);
        if (Number.isNaN(start.getTime())) return;
        const end = new Date(start.getTime() + 3_600_000);
        setEndDateValue(toDateInputValue(end));
        setEndTimeValue(toTimeInputValue(end));
    };

    const bumpEndByHours = (delta: number) => {
        const start = new Date(`${startDateValue}T${startTimeValue || DEFAULT_TIME}:00`);
        const end = new Date(`${endDateValue}T${endTimeValue || DEFAULT_TIME}:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
        const next = new Date(end.getTime() + delta * 3_600_000);
        if (next.getTime() <= start.getTime()) return;
        setEndDateValue(toDateInputValue(next));
        setEndTimeValue(toTimeInputValue(next));
    };

    const canShrinkEndByOneHour = useMemo(() => {
        const start = new Date(`${startDateValue}T${startTimeValue || DEFAULT_TIME}:00`);
        const end = new Date(`${endDateValue}T${endTimeValue || DEFAULT_TIME}:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
        return end.getTime() - start.getTime() > 3_600_000;
    }, [startDateValue, startTimeValue, endDateValue, endTimeValue]);

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
        const s = effectiveStartFromInitial(initialStart);
        setStartDateValue(toDateInputValue(s));
        setStartTimeValue(toTimeInputValue(s));

        if (initialEnd) {
            const e = new Date(initialEnd);
            setEndDateValue(toDateInputValue(e));
            setEndTimeValue(toTimeInputValue(e));
        } else {
            const e = new Date(s.getTime() + 3_600_000);
            setEndDateValue(toDateInputValue(e));
            setEndTimeValue(toTimeInputValue(e));
        }
        setTitle(DEFAULT_TITLE);
        setRepeatWeekly(false);
        setRepeatWeeks(8);
        setNewFieldKey("");
        setNewFieldType(DEFAULT_FIELD_TYPE);
    }, [initialStart, initialEnd, open]);

    const resetForm = () => {
        setTitle(DEFAULT_TITLE);
        const s = effectiveStartFromInitial(initialStart);
        setStartDateValue(toDateInputValue(s));
        setStartTimeValue(toTimeInputValue(s));
        if (initialEnd) {
            const e = new Date(initialEnd);
            setEndDateValue(toDateInputValue(e));
            setEndTimeValue(toTimeInputValue(e));
        } else {
            const e = new Date(s.getTime() + 3_600_000);
            setEndDateValue(toDateInputValue(e));
            setEndTimeValue(toTimeInputValue(e));
        }
        setRepeatWeekly(false);
        setRepeatWeeks(8);
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

        const start = new Date(`${startDateValue}T${startTimeValue || DEFAULT_TIME}:00`);
        const end = new Date(`${endDateValue}T${endTimeValue || DEFAULT_TIME}:00`);
        if (end.getTime() <= start.getTime()) {
            toast.error("End time must be after start time");
            return;
        }

        const normalizedValues = normalizeEventValues(activeSchema, eventValues);

        createEvent(
            {
                title,
                start,
                end,
                repeatWeekly,
                repeatWeeks,
                selectedTemplateId: selectedTemplateId ?? undefined,
                schema: activeSchema,
                data: normalizedValues,
            },
            {
                onSuccess: () => {
                    resetForm();
                    onOpenChange(false);
                },
            },
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
            <DialogContent className="sm:max-w-[480px] border-stone-400/50 bg-[#e7e2d4] text-stone-800 max-h-[90vh] overflow-y-auto">
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

                    <div className="space-y-3 rounded-lg border border-stone-400/35 bg-stone-200/20 px-3 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                            When
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="start-date" className="text-stone-700 text-xs">Start date</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDateValue}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setStartDateValue(v);
                                        setEndToOneHourAfterStart(v, startTimeValue);
                                    }}
                                    required
                                    disabled={isSubmitting}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="start-time" className="text-stone-700 text-xs">Start time</Label>
                                <Input
                                    id="start-time"
                                    type="time"
                                    value={startTimeValue}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setStartTimeValue(v);
                                        setEndToOneHourAfterStart(startDateValue, v);
                                    }}
                                    disabled={isSubmitting}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="end-date" className="text-stone-700 text-xs">End date</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDateValue}
                                    onChange={(e) => setEndDateValue(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="border-stone-400/50 bg-[#efe9dc] text-stone-800 scheme-light focus-visible:ring-sky-500/25"
                                />
                            </div>
                            <div className="space-y-1.5 min-w-0">
                                <Label htmlFor="end-time" className="text-stone-700 text-xs">End time</Label>
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
                                        id="end-time"
                                        type="time"
                                        value={endTimeValue}
                                        onChange={(e) => setEndTimeValue(e.target.value)}
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

                    <div className="rounded-md border border-stone-400/40 bg-stone-200/30 px-3 py-2 space-y-2">
                        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={repeatWeekly}
                                onChange={(e) => setRepeatWeekly(e.target.checked)}
                                disabled={isSubmitting}
                                className="accent-[#8d9b67]"
                            />
                            Repeat weekly
                        </label>
                        {repeatWeekly && (
                            <div className="flex items-center gap-2 pl-6">
                                <Label htmlFor="repeat-weeks" className="text-xs text-stone-600 shrink-0">Weeks</Label>
                                <Input
                                    id="repeat-weeks"
                                    type="number"
                                    min={1}
                                    max={52}
                                    value={repeatWeeks}
                                    onChange={(e) => setRepeatWeeks(Number(e.target.value) || 1)}
                                    disabled={isSubmitting}
                                    className="h-8 w-20 border-stone-400/50 bg-[#efe9dc] text-stone-800"
                                />
                            </div>
                        )}
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
