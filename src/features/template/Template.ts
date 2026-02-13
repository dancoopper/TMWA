import { z } from "zod";
import { TemplateFieldsSchema } from "./templateFields";

export const TemplateSchema = z.object({
    id: z.number(),
    name: z.string().default("Untitled template"),
    isHidden: z.boolean().default(false),
    createdAt: z.string().default(""),
    userId: z.uuid().default(""),
    data: TemplateFieldsSchema.catch([]),
});

export type Template = z.infer<typeof TemplateSchema>;
