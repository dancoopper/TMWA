import type { TemplateField } from "@/features/template/templateFields";
import { z } from "zod";

const EventFieldValueSchema = z.object({
    id: z.string().min(1),
    value: z.union([z.string(), z.boolean()]),
});

const EventFieldValuesSchema = z.array(EventFieldValueSchema);

export type EventFieldValue = z.infer<typeof EventFieldValueSchema>;

function getDefaultValue(field: TemplateField): EventFieldValue["value"] {
    if (field.type === "checkbox") return false;
    return "";
}

export function buildDefaultEventValues(fields: TemplateField[]): EventFieldValue[] {
    return fields.map((field) => ({
        id: field.id,
        value: getDefaultValue(field),
    }));
}

export function normalizeEventValues(
    fields: TemplateField[],
    values: unknown,
): EventFieldValue[] {
    const parsed = EventFieldValuesSchema.safeParse(values);
    const parsedValues = parsed.success ? parsed.data : [];
    const byId = new Map(parsedValues.map((item) => [item.id, item.value]));

    return fields.map((field) => {
        const candidate = byId.get(field.id);
        if (field.type === "checkbox") {
            return {
                id: field.id,
                value: typeof candidate === "boolean" ? candidate : false,
            };
        }

        return {
            id: field.id,
            value: typeof candidate === "string" ? candidate : "",
        };
    });
}

export function getEventValueByFieldId(
    values: EventFieldValue[],
    fieldId: string,
): EventFieldValue["value"] | null {
    const item = values.find((value) => value.id === fieldId);
    return item?.value ?? null;
}

export function buildEventPreview(
    fields: TemplateField[],
    values: unknown,
): string {
    if (fields.length === 0) return "No details";
    const normalized = normalizeEventValues(fields, values);
    if (normalized.length === 0) return "No details";

    for (const field of fields) {
        const value = getEventValueByFieldId(normalized, field.id);
        if (field.type === "checkbox") {
            return `${field.name}: ${value === true ? "Yes" : "No"}`;
        }
        if (typeof value === "string" && value.trim().length > 0) {
            return `${field.name}: ${value}`;
        }
    }

    return "No details";
}
