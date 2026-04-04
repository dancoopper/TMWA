import { useMemo } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useTasksEvents } from "@/features/dashboard/hooks/useTasksEvents";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import { normalizeTemplateFields } from "@/features/template/templateFields";
import { taskMatchesSearch } from "@/features/event/taskBoardUtils";
import type { Event } from "@/features/event/models/Event";
import { EVENT_PALETTE, normalizeEventColorKey } from "@/features/event/eventColors";
import { ChevronRight } from "lucide-react";

type GroupId = "overdue" | "today" | "soon" | "later";

const GROUP_ORDER: GroupId[] = ["overdue", "today", "soon", "later"];

const GROUP_LABEL: Record<GroupId, string> = {
    overdue: "Overdue",
    today: "Today",
    soon: "Next 7 days",
    later: "Later",
};

function startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function dayDiff(eventDay: Date, todayStart: Date): number {
    const t0 = startOfDay(eventDay).getTime();
    const t1 = todayStart.getTime();
    return Math.round((t0 - t1) / 86_400_000);
}

function groupForEvent(event: Event, now: Date): GroupId {
    const todayStart = startOfDay(now);
    const d = dayDiff(event.start, todayStart);
    if (d < 0) return "overdue";
    if (d === 0) return "today";
    if (d >= 1 && d <= 7) return "soon";
    return "later";
}

function formatEventWhen(d: Date): string {
    return d.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function TasksListView() {
    const { data: events = [], isLoading } = useTasksEvents();
    const { data: templates = [] } = useTemplates({ includeHidden: true });
    const { searchQuery, selectEvent, selectedWorkspaceId, openEditEventDialog } = useDashboardStore();

    const templatesById = useMemo(() => {
        const m = new Map<number, ReturnType<typeof normalizeTemplateFields>>();
        for (const t of templates) {
            m.set(t.id, normalizeTemplateFields(t.data));
        }
        return m;
    }, [templates]);

    const filtered = useMemo(() => {
        return events.filter((ev) => {
            const fields = templatesById.get(ev.templateId);
            return taskMatchesSearch(ev, searchQuery, fields);
        }).sort((a, b) => a.start.getTime() - b.start.getTime());
    }, [events, searchQuery, templatesById]);

    const grouped = useMemo(() => {
        const now = new Date();
        const map = new Map<GroupId, Event[]>();
        for (const g of GROUP_ORDER) map.set(g, []);
        for (const ev of filtered) {
            const g = groupForEvent(ev, now);
            map.get(g)!.push(ev);
        }
        return map;
    }, [filtered]);

    if (!selectedWorkspaceId) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-stone-500 p-6">
                Select a workspace to see tasks.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 p-6 space-y-3">
                <div className="h-8 w-48 bg-stone-300/50 rounded animate-pulse" />
                <div className="h-14 w-full bg-stone-300/40 rounded animate-pulse" />
                <div className="h-14 w-full bg-stone-300/40 rounded animate-pulse" />
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center p-8 text-stone-600">
                <p className="text-sm font-medium">No tasks in this range</p>
                <p className="text-xs text-stone-500 max-w-xs">
                    Tasks are events in the selected workspace. Add one from the header or switch to Calendar.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {GROUP_ORDER.map((gid) => {
                    const list = grouped.get(gid) ?? [];
                    if (list.length === 0) return null;
                    return (
                        <section key={gid}>
                            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 mb-2 px-1">
                                {GROUP_LABEL[gid]}
                                <span className="ml-1.5 font-normal text-stone-400">({list.length})</span>
                            </h2>
                            <ul className="rounded-lg border border-stone-400/35 bg-[#e8e4d9]/80 divide-y divide-stone-400/25 overflow-hidden">
                                {list.map((ev) => (
                                        <li key={ev.id}>
                                            <button
                                                type="button"
                                                onClick={() => selectEvent(ev)}
                                                onDoubleClick={(e) => {
                                                    e.preventDefault();
                                                    openEditEventDialog(ev);
                                                }}
                                                className="w-full flex items-start gap-3 text-left pl-2.5 pr-3 py-2.5 hover:bg-stone-300/40 transition-colors border-l-[3px]"
                                                style={{
                                                    borderLeftColor:
                                                        EVENT_PALETTE[normalizeEventColorKey(ev.colorKey)].dot,
                                                }}
                                            >
                                                <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-stone-800 truncate">
                                                        {ev.title}
                                                    </p>
                                                    <p className="text-[10px] text-stone-500 mt-0.5">
                                                        {formatEventWhen(ev.start)}
                                                    </p>
                                                </div>
                                            </button>
                                        </li>
                                ))}
                            </ul>
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
