import { useMemo } from "react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useTasksEvents } from "@/features/dashboard/hooks/useTasksEvents";
import { useTemplates } from "@/features/template/hooks/useTemplates";
import { normalizeTemplateFields } from "@/features/template/templateFields";
import {
    findStatusSelectField,
    getBoardColumnForEvent,
    taskMatchesSearch,
} from "@/features/event/taskBoardUtils";
import type { Event } from "@/features/event/models/Event";
import { EVENT_PALETTE, normalizeEventColorKey } from "@/features/event/eventColors";

function buildColumnOrder(events: Event[], templatesById: Map<number, ReturnType<typeof normalizeTemplateFields>>): string[] {
    const seen = new Set<string>();
    let preferred: string[] = [];

    for (const ev of events) {
        const fields = templatesById.get(ev.templateId) ?? [];
        const sf = findStatusSelectField(fields);
        if (sf?.options?.length && preferred.length === 0) {
            preferred = [...sf.options];
        }
        const col = getBoardColumnForEvent(ev, fields);
        seen.add(col);
    }

    const ordered = preferred.filter((c) => seen.has(c));
    const rest = [...seen].filter((c) => !ordered.includes(c)).sort();
    return [...ordered, ...rest];
}

export default function TasksBoardView() {
    const { data: events = [], isLoading } = useTasksEvents();
    const { data: templates = [] } = useTemplates({ includeHidden: true });
    const { searchQuery, selectEvent, selectedWorkspaceId } = useDashboardStore();

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
        });
    }, [events, searchQuery, templatesById]);

    const { columns, byColumn } = useMemo(() => {
        const byColumn = new Map<string, Event[]>();
        for (const ev of filtered) {
            const fields = templatesById.get(ev.templateId) ?? [];
            const col = getBoardColumnForEvent(ev, fields);
            const list = byColumn.get(col) ?? [];
            list.push(ev);
            byColumn.set(col, list);
        }
        const columns = buildColumnOrder(filtered, templatesById);
        return { columns, byColumn };
    }, [filtered, templatesById]);

    if (!selectedWorkspaceId) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-stone-500 p-6">
                Select a workspace to see tasks.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 p-6 flex gap-3 overflow-hidden">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[200px] flex-1 h-full bg-stone-300/40 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center p-8 text-stone-600">
                <p className="text-sm font-medium">No tasks in this range</p>
                <p className="text-xs text-stone-500 max-w-xs">
                    Add template fields named &quot;Status&quot; (select) to organize the board into columns.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
            <div className="flex h-full gap-3 min-h-0" style={{ minWidth: `${columns.length * 220}px` }}>
                {columns.map((col) => {
                    const list = byColumn.get(col) ?? [];
                    return (
                        <div
                            key={col}
                            className="flex flex-col min-w-[220px] max-w-[280px] flex-1 rounded-lg border border-stone-400/40 bg-[#e8e4d9]/60 min-h-0"
                        >
                            <div className="shrink-0 px-3 py-2 border-b border-stone-400/30">
                                <h3 className="text-[11px] font-semibold text-stone-700 truncate">
                                    {col}
                                </h3>
                                <p className="text-[10px] text-stone-500">{list.length}</p>
                            </div>
                            <ul className="flex-1 overflow-y-auto p-2 space-y-2">
                                {list.map((ev) => (
                                    <li key={ev.id}>
                                        <button
                                            type="button"
                                            onClick={() => selectEvent(ev)}
                                            className="w-full text-left rounded-md border border-stone-400/35 bg-[#f3f0e8] pl-2 pr-2.5 py-2 hover:border-stone-500/50 hover:bg-[#ebe6dc] transition-colors shadow-sm border-l-[3px]"
                                            style={{
                                                borderLeftColor:
                                                    EVENT_PALETTE[normalizeEventColorKey(ev.colorKey)].dot,
                                            }}
                                        >
                                            <p className="text-xs font-medium text-stone-800 line-clamp-2">
                                                {ev.title}
                                            </p>
                                            <p className="text-[10px] text-stone-500 mt-1">
                                                {ev.start.toLocaleString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
