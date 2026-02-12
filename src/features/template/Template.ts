import { z } from "zod";

export const TemplateSchema = z.object({
    id: z.number(),
    createdAt: z.string().default(""),
    userId: z.uuid().default(""),
    data: z.json().default({}),
});

export type Template = z.infer<typeof TemplateSchema>;
