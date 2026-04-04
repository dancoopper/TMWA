import { useQuery } from "@tanstack/react-query";
import { availabilityShareRepository } from "@/repositories/availabilityShareRepository";
import { eventRepository } from "@/repositories/eventRepository";

export type FreeSlot = {
    start: Date;
    end: Date;
    isBooked: boolean;
};

/** Build 1-hour slots between 09:00 and 17:00 for each day in range. */
function buildDaySlots(date: Date): { start: Date; end: Date }[] {
    const slots: { start: Date; end: Date }[] = [];
    for (let hour = 9; hour < 17; hour++) {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(date);
        end.setHours(hour + 1, 0, 0, 0);
        slots.push({ start, end });
    }
    return slots;
}

/** Returns true if two intervals overlap. */
function overlaps(
    aStart: Date,
    aEnd: Date,
    bStart: Date,
    bEnd: Date,
): boolean {
    return aStart < bEnd && aEnd > bStart;
}

export function useFindATime(shareId: string | undefined) {
    return useQuery<FreeSlot[]>({
        queryKey: ["find-a-time", shareId],
        enabled: !!shareId,
        queryFn: async () => {
            if (!shareId) return [];

            const share = await availabilityShareRepository.getShareById(shareId);

            // Build a UTC-safe date range spanning the full start/end days
            const rangeStart = new Date(share.startDate + "T00:00:00");
            const rangeEnd = new Date(share.endDate + "T23:59:59");

            // Fetch events in the workspace for the date range
            const events = await eventRepository.getEventsByRange(
                share.workspaceId,
                rangeStart,
                rangeEnd,
            );

            // Fetch already-booked slots
            const bookings = await availabilityShareRepository.getBookingsForShare(shareId);

            // Enumerate every day in the range
            const slots: FreeSlot[] = [];
            const cursor = new Date(rangeStart);
            cursor.setHours(0, 0, 0, 0);

            const endDay = new Date(rangeEnd);
            endDay.setHours(0, 0, 0, 0);

            while (cursor <= endDay) {
                const daySlots = buildDaySlots(cursor);
                for (const slot of daySlots) {
                    // Remove slots that overlap with existing calendar events
                    const blockedByEvent = events.some((ev) =>
                        overlaps(slot.start, slot.end, ev.start, ev.end),
                    );

                    if (blockedByEvent) {
                        // Skip — slot is occupied by an existing event
                        cursor.setDate(cursor.getDate()); // no-op, continuation
                        continue;
                    }

                    // Check if already booked via this share
                    const isBooked = bookings.some((b) =>
                        overlaps(
                            slot.start,
                            slot.end,
                            new Date(b.bookedSlotStart),
                            new Date(b.bookedSlotEnd),
                        ),
                    );

                    slots.push({ ...slot, isBooked });
                }
                cursor.setDate(cursor.getDate() + 1);
            }

            return slots;
        },
    });
}
