import { z } from "zod";

export const TemplateSchema = z.object({
    id: z.number(),
    createdAt: z.string(),
    userId: z.uuid(),
    data: z.json(),
});

export type Template = z.infer<typeof TemplateSchema>;
