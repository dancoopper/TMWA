import { z } from "zod";

export const EventSchema = z.object({
    id: z.uuid(),
    event_data: z.json(),
    template_id: z.number(),
    workspaces_id: z.number(),
});

export type Event = z.infer<typeof EventSchema>;
