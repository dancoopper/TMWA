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
