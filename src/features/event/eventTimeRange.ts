import type { Event } from "@/features/event/models/Event";

export function startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

/** Event intersects [slotStart, slotEnd) for a given calendar day and hour row. */
export function eventOverlapsHour(event: Event, day: Date, hour: number): boolean {
    const slotStart = new Date(day);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(day);
    slotEnd.setHours(hour + 1, 0, 0, 0);
    return event.start < slotEnd && event.end > slotStart;
}

/** Event overlaps any part of calendar day `day` (local). */
export function eventOverlapsCalendarDay(event: Event, day: Date): boolean {
    const ds = startOfDay(day);
    const de = new Date(ds);
    de.setHours(23, 59, 59, 999);
    return event.start <= de && event.end >= ds;
}

export function formatEventTimeRange(event: Event): string {
    const opts: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    };
    const a = event.start.toLocaleString("en-US", opts);
    const b = event.end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${a} – ${b}`;
}

export function addDays(d: Date, days: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + days);
    return x;
}

/**
 * Visible segment of `event` clipped to [windowStart, windowEnd).
 * Percents are relative to the window height in time (for absolute positioning in a time grid).
 */
export function eventSegmentInWindow(
    event: Event,
    windowStart: Date,
    windowEnd: Date,
): { topPct: number; heightPct: number } | null {
    const w0 = windowStart.getTime();
    const w1 = windowEnd.getTime();
    const total = w1 - w0;
    if (total <= 0) return null;
    const ev0 = Math.max(event.start.getTime(), w0);
    const ev1 = Math.min(event.end.getTime(), w1);
    if (ev1 <= ev0) return null;
    return {
        topPct: ((ev0 - w0) / total) * 100,
        heightPct: ((ev1 - ev0) / total) * 100,
    };
}

/** Greedy lane assignment for overlapping intervals (left-to-right columns). */
export function assignEventLanes(events: Event[]): { laneById: Map<number, number>; laneCount: number } {
    const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
    const laneEnds: number[] = [];
    const laneById = new Map<number, number>();
    for (const ev of sorted) {
        const t0 = ev.start.getTime();
        const idx = laneEnds.findIndex((endMs) => t0 >= endMs);
        let lane: number;
        if (idx === -1) {
            lane = laneEnds.length;
            laneEnds.push(ev.end.getTime());
        } else {
            lane = idx;
            laneEnds[lane] = Math.max(laneEnds[lane], ev.end.getTime());
        }
        laneById.set(ev.id, lane);
    }
    return { laneById, laneCount: Math.max(1, laneEnds.length) };
}
