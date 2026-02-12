import { z } from "zod";

export const EventSchema = z.object({
    id: z.uuid(),
    data: z.json(),
    templateId: z.number(),
    workspaceId: z.number(),
    date: z.date(),
    title: z.string(),
});

export type Event = z.infer<typeof EventSchema>;
