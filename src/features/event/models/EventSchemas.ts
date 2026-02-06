import { z } from "zod";

export const EventSchemasSchema = z.object({
    id: z.number(),
    created_at: z.string().default(""),
    user_id: z.uuid().default(""),
    schema_data: z.json().default({}),
});

export type EventSchemas = z.infer<typeof EventSchemasSchema>;
