import { z } from "zod";

export const TemplateFieldTypeSchema = z.enum(["text", "checkbox", "select"]);

export type TemplateFieldType = z.infer<typeof TemplateFieldTypeSchema>;

export const TemplateFieldSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: TemplateFieldTypeSchema,
    options: z.array(z.string().min(1)).optional(),
});

export type TemplateField = z.infer<typeof TemplateFieldSchema>;

export const TemplateFieldsSchema = z.array(TemplateFieldSchema);

export function normalizeTemplateFields(input: unknown): TemplateField[] {
    const parsed = TemplateFieldsSchema.safeParse(input);
    if (!parsed.success) return [];

    return parsed.data.map((field) => {
        if (field.type === "select") {
            return {
                ...field,
                options: (field.options ?? []).filter((option) => option.trim().length > 0),
            };
        }
        return field;
    });
}
