import { z } from "zod";

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
});

export type Event = z.infer<typeof EventSchema>;
