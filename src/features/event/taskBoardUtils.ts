import { buildEventPreview, getEventValueByFieldId, normalizeEventValues } from "@/features/event/eventFieldValues";
import type { Event } from "@/features/event/models/Event";
import type { TemplateField } from "@/features/template/templateFields";

export function findStatusSelectField(fields: TemplateField[]): TemplateField | null {
    const byName = fields.find(
        (f) => f.type === "select" && /status/i.test(f.name.trim()),
    );
    if (byName) return byName;
    return fields.find((f) => f.type === "select" && (f.options?.length ?? 0) > 0) ?? null;
}

/** Column label for board; single column if template has no usable status select. */
export function getBoardColumnForEvent(event: Event, fields: TemplateField[]): string {
    const statusField = findStatusSelectField(fields);
    if (!statusField?.options?.length) return "All tasks";

    const vals = normalizeEventValues(fields, event.data);
    const raw = getEventValueByFieldId(vals, statusField.id);
    const s = typeof raw === "string" ? raw : "";
    if (s && statusField.options.includes(s)) return s;
    return statusField.options[0] ?? "All tasks";
}

export function taskMatchesSearch(event: Event, query: string, fields: TemplateField[] | undefined): boolean {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    if (event.title.toLowerCase().includes(q)) return true;
    if (fields?.length) {
        const preview = buildEventPreview(fields, event.data);
        if (preview.toLowerCase().includes(q)) return true;
    }
    return false;
}
