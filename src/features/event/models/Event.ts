import { z } from "zod";

export const EVENT_COLOR_KEYS = [
    "sage",
    "sky",
    "lavender",
    "coral",
    "amber",
    "rose",
    "slate",
    "mist",
] as const;

export type EventColorKey = (typeof EVENT_COLOR_KEYS)[number];

export const DEFAULT_EVENT_COLOR: EventColorKey = "sage";

export const EventSchema = z.object({
    id: z.number(),
    data: z.json(),
    templateId: z.number(),
    workspaceId: z.number(),
    /** Event start (maps to DB `date`). */
    start: z.date(),
    /** Event end instant (maps to DB `ends_at`). */
    end: z.date(),
    title: z.string(),
    /** Maps to DB `color_key`. */
    colorKey: z.enum(EVENT_COLOR_KEYS),
});

export type Event = z.infer<typeof EventSchema>;
