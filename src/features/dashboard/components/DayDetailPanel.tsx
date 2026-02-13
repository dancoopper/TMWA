import { useEvents } from "@/features/event/hooks/useEvents";
import { useDeleteEvent } from "@/features/event/hooks/useDeleteEvent";
import type { Event } from "@/features/event/models/Event";
import EditEventDialog from "@/features/event/components/EditEventDialog";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import { normalizeTemplateFields } from "@/features/template/templateFields";
import { buildEventPreview, normalizeEventValues } from "@/features/event/eventFieldValues";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useMemo, useState } from "react";
import { PanelRightClose, PanelRight, PenLine, Trash2, X } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TIME_SLOTS = [
    "12AM", "1AM", "2AM", "3AM", "4AM", "5AM",
    "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
    "12PM", "1PM", "2PM", "3PM", "4PM", "5PM",
    "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",
];

function parseHour24(timeSlot: string) {
    const parsedHour = Number.parseInt(timeSlot, 10);
    const isPm = timeSlot.endsWith("PM");
    const isAm = timeSlot.endsWith("AM");
    if (!isPm && !isAm) return null;

    let hour24 = parsedHour % 12;
    if (isPm) hour24 += 12;
    return hour24;
}

function formatCurrentTimeLabel(date: Date) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}

function formatDetailValue(value: unknown): string {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string") return value.trim().length > 0 ? value : "N/A";
    if (typeof value === "number") return String(value);
    if (value === null || value === undefined) return "N/A";
    return String(value);
}

function buildSelectedEventDetails(
    event: Event,
    templatesById: Map<number, ReturnType<typeof normalizeTemplateFields>>,
) {
    const templateFields = templatesById.get(event.templateId) ?? [];

    if (templateFields.length > 0) {
        const normalized = normalizeEventValues(templateFields, event.data);
        const valueById = new Map(normalized.map((item) => [item.id, item.value]));
        return templateFields.map((field) => ({
            label: field.name,
            value: formatDetailValue(valueById.get(field.id)),
        }));
    }

    if (Array.isArray(event.data)) {
        const details: Array<{ label: string; value: string }> = [];
        for (const item of event.data) {
            if (item && typeof item === "object" && !Array.isArray(item)) {
                for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
                    details.push({ label: key, value: formatDetailValue(value) });
                }
            }
        }
        return details;
    }

    return [];
}

export default function DayDetailPanel() {
    const {
        rightPanelCollapsed,
        toggleRightPanel,
        selectedDate,
        selectedEvent,
        selectEvent,
        clearSelectedEvent,
        openCreateEventDialog,
    } = useDashboardStore();
    const today = new Date();
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);
    const { data: events = [] } = useEvents({ startDate: dayStart, endDate: dayEnd });
    const { data: templates = [] } = useTemplates({ includeHidden: true });
    const templatesById = useMemo(() => {
        const mapped = new Map<number, ReturnType<typeof normalizeTemplateFields>>();
        for (const template of templates) {
            mapped.set(template.id, normalizeTemplateFields(template.data));
        }
        return mapped;
    }, [templates]);
    const eventsByHour = useMemo(() => {
        const grouped = new Map<number, Event[]>();

        for (const event of events) {
            const hour = event.date.getHours();
            const slotEvents = grouped.get(hour) ?? [];
            slotEvents.push(event);
            grouped.set(hour, slotEvents);
        }

        return grouped;
    }, [events]);

    const getSlotEvents = (timeSlot: string) => {
        const hour24 = parseHour24(timeSlot);
        if (hour24 === null) return [];

        return eventsByHour.get(hour24) ?? [];
    };
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeLabel = formatCurrentTimeLabel(today);
    const showCurrentDayIndicator = isSameDay(selectedDate, today);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { mutate: deleteEvent, isPending: isDeletePending } = useDeleteEvent();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };
    const formatSelectedEventDate = (date: Date) =>
        date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
        });

    const handleDeleteSelectedEvent = () => {
        if (!selectedEvent) return;

        deleteEvent(selectedEvent.id, {
            onSuccess: () => {
                clearSelectedEvent();
                setIsDeleteDialogOpen(false);
            },
        });
    };
    const selectedEventDetails = useMemo(() => {
        if (!selectedEvent) return [];
        return buildSelectedEventDetails(selectedEvent, templatesById);
    }, [selectedEvent, templatesById]);

    return (
        <aside
            className={`
                flex flex-col h-full border-l border-stone-400/40
                transition-all duration-500 ease-out overflow-hidden
                ${rightPanelCollapsed ? "w-10" : "w-64"}
            `}
            style={{ backgroundColor: "#dfdacb" }}
        >
            {/* Header with Toggle */}
            <div className="p-2 border-b border-stone-400/40 shrink-0">
                {rightPanelCollapsed ? (
                    <button
                        onClick={toggleRightPanel}
                        className="mx-auto mt-1 block p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                    >
                        <PanelRight className="w-4 h-4 text-stone-500" />
                    </button>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-stone-800">
                                {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
                            </h2>
                            <p className="text-stone-500 text-xs">
                                {formatDate(selectedDate)}
                            </p>
                        </div>
                        <button
                            onClick={toggleRightPanel}
                            className="p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                        >
                            <PanelRightClose className="w-4 h-4 text-stone-500" />
                        </button>
                    </div>
                )}
            </div>

            {/* Time Slots - Only show when expanded */}
            {!rightPanelCollapsed && (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className={selectedEvent ? "h-1/2 overflow-y-auto" : "flex-1 overflow-y-auto"}>
                        {TIME_SLOTS.map((time) => {
                            const slotEvents = getSlotEvents(time);
                            const slotHour = parseHour24(time);
                            const showCurrentTimeLine =
                                showCurrentDayIndicator && slotHour !== null && slotHour === currentHour;

                            return (
                                <div
                                    key={time}
                                    className="relative flex border-b border-stone-400/40 min-h-[40px] hover:bg-[#1f2128]/15 transition-colors duration-200"
                                >
                                    {showCurrentTimeLine ? (
                                        <div
                                            className="pointer-events-none absolute left-0 right-0 z-20"
                                            style={{ top: `${(currentMinute / 60) * 100}%` }}
                                        >
                                            <div className="absolute left-0 -translate-y-1/2 rounded-sm bg-rose-600 px-1 py-0.5 text-[9px] font-semibold leading-none text-white">
                                                {currentTimeLabel}
                                            </div>
                                            <div className="border-t border-rose-500/85" />
                                        </div>
                                    ) : null}
                                    <div className="w-12 shrink-0 py-2 px-2 text-[10px] text-stone-500 text-right">
                                        {time}
                                    </div>
                                    <div
                                        className="relative flex-1 border-l border-stone-400/40 px-2 py-1.5 cursor-pointer hover:bg-[#1f2128]/15 transition-colors duration-200"
                                        onClick={() => {
                                            if (slotHour === null) return;
                                            const slotDate = new Date(selectedDate);
                                            slotDate.setHours(slotHour, 0, 0, 0);
                                            openCreateEventDialog(slotDate);
                                        }}
                                    >
                                        {slotEvents.slice(0, 2).map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    selectEvent(event);
                                                }}
                                                className="rounded-sm border border-stone-500/20 bg-stone-200/55 px-1.5 py-1 mb-1 last:mb-0 cursor-pointer transition-all duration-150 hover:bg-stone-300/80 hover:border-stone-600/45 hover:shadow-[inset_0_0_0_1px_rgba(87,83,78,0.35)] hover:-translate-y-px"
                                                title={event.title}
                                            >
                                                <p className="text-[10px] leading-tight truncate text-stone-800 font-medium">
                                                    {event.title}
                                                </p>
                                                <p className="text-[9px] leading-tight truncate text-stone-600">
                                                    {buildEventPreview(
                                                        templatesById.get(event.templateId) ?? [],
                                                        event.data,
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                        {slotEvents.length > 2 ? (
                                            <p className="text-[10px] leading-tight text-stone-500">
                                                +{slotEvents.length - 2}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedEvent ? (
                        <div className="h-1/2 border-t border-stone-400/40 px-2 py-2.5 flex flex-col min-h-0">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-stone-800 truncate" title={selectedEvent.title}>
                                        {selectedEvent.title}
                                    </p>
                                    <p className="text-[11px] text-stone-600">
                                        {formatSelectedEventDate(selectedEvent.date)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <EditEventDialog
                                        event={selectedEvent}
                                        onEventUpdated={selectEvent}
                                        trigger={
                                            <button
                                                type="button"
                                                className="p-1 rounded-md text-stone-600 hover:text-sky-700 hover:bg-sky-500/20 transition-colors duration-200"
                                                aria-label="Edit event"
                                                title="Edit event"
                                            >
                                                <PenLine className="w-3.5 h-3.5" />
                                            </button>
                                        }
                                    />
                                    <AlertDialog
                                        open={isDeleteDialogOpen}
                                        onOpenChange={setIsDeleteDialogOpen}
                                    >
                                        <AlertDialogTrigger asChild>
                                            <button
                                                type="button"
                                                className="p-1 rounded-md text-stone-600 hover:text-rose-700 hover:bg-rose-500/20 transition-colors duration-200"
                                                aria-label="Delete event"
                                                title="Delete event"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent size="sm" className="border-stone-400/50 bg-[#e7e2d4] text-stone-800">
                                            <AlertDialogHeader>
                                                <AlertDialogMedia className="bg-rose-500/20 text-rose-700">
                                                    <Trash2 className="w-6 h-6" />
                                                </AlertDialogMedia>
                                                <AlertDialogTitle className="text-stone-800">Delete event?</AlertDialogTitle>
                                                <AlertDialogDescription className="text-stone-600">
                                                    This will permanently delete{" "}
                                                    <strong>{selectedEvent.title}</strong> on{" "}
                                                    <strong>{formatSelectedEventDate(selectedEvent.date)}</strong>. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    variant="outline"
                                                    className="border-stone-500/50 bg-stone-200/60 text-stone-700 hover:bg-stone-300/70 hover:text-stone-800"
                                                >
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    variant="destructive"
                                                    className="bg-rose-700 text-white hover:bg-rose-800"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeleteSelectedEvent();
                                                    }}
                                                    disabled={isDeletePending}
                                                >
                                                    {isDeletePending ? "Deleting..." : "Delete"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <button
                                        type="button"
                                        onClick={clearSelectedEvent}
                                        className="p-1 rounded-md text-stone-600 hover:text-stone-800 hover:bg-stone-300/60 transition-colors duration-200"
                                        aria-label="Close selected event details"
                                        title="Close"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 space-y-1.5 overflow-y-auto pr-1">
                                {selectedEventDetails.length > 0 ? (
                                    selectedEventDetails.map((detail, index) => (
                                        <div
                                            key={`${detail.label}-${index}`}
                                            className="rounded-sm border border-stone-400/35 bg-stone-100/55 px-2 py-1"
                                        >
                                            <p className="text-[10px] uppercase tracking-wide text-stone-500 truncate">
                                                {detail.label}
                                            </p>
                                            <p className="text-[11px] text-stone-800 wrap-break-word">
                                                {detail.value}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[11px] text-stone-500">No details available.</p>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {rightPanelCollapsed && (
                <div className="mt-auto p-2 border-t border-stone-400/40">
                    <button
                        onClick={toggleRightPanel}
                        className="mx-auto block p-1.5 rounded-md hover:bg-stone-300/60 transition-colors duration-200"
                    >
                        <PanelRight className="w-4 h-4 text-stone-500" />
                    </button>
                </div>
            )}
        </aside>
    );
}
